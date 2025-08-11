import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Story from '../models/Story.js';

export const setupSocketHandlers = (io) => {
  // Store socket to user mapping
  const socketUsers = new Map();

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = user._id;
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', async (socket) => {
    console.log(`User connected: ${socket.user.username} (${socket.userId})`);

    // Update user online status
    await User.findByIdAndUpdate(socket.userId, {
      isOnline: true,
      lastSeen: new Date()
    });

    socketUsers.set(socket.id, {
      userId: socket.userId,
      username: socket.user.username,
      avatar: socket.user.avatar
    });

    // Join user to their stories
    const userStories = await Story.find({
      $or: [
        { owner: socket.userId },
        { 'collaborators.user': socket.userId }
      ]
    });

    userStories.forEach(story => {
      socket.join(`story-${story._id}`);
    });

    // Handle joining a story
    socket.on('join-story', async (storyId) => {
      try {
        const story = await Story.findById(storyId);
        if (!story || !story.userHasAccess(socket.userId)) {
          socket.emit('error', { message: 'Access denied' });
          return;
        }

        socket.join(`story-${storyId}`);
        await story.addActiveUser(socket.userId, story.currentNodeId);

        // Notify other users in the story
        socket.to(`story-${storyId}`).emit('user-joined-story', {
          userId: socket.userId,
          username: socket.user.username,
          avatar: socket.user.avatar,
          currentNodeId: story.currentNodeId
        });

        // Send current active users to the joining user
        const activeUsers = await Story.findById(storyId)
          .populate('activeUsers.user', 'username avatar')
          .then(story => story.activeUsers);

        socket.emit('story-users', activeUsers);

        console.log(`${socket.user.username} joined story: ${storyId}`);
      } catch (error) {
        console.error('Join story error:', error);
        socket.emit('error', { message: 'Error joining story' });
      }
    });

    // Handle leaving a story
    socket.on('leave-story', async (storyId) => {
      try {
        socket.leave(`story-${storyId}`);
        await Story.findByIdAndUpdate(storyId, {
          $pull: { activeUsers: { user: socket.userId } }
        });

        socket.to(`story-${storyId}`).emit('user-left-story', {
          userId: socket.userId,
          username: socket.user.username
        });

        console.log(`${socket.user.username} left story: ${storyId}`);
      } catch (error) {
        console.error('Leave story error:', error);
      }
    });

    // Handle story updates
    socket.on('story-update', async (data) => {
      try {
        const { storyId, story, currentNodeId, nextNodeId } = data;
        
        const storyDoc = await Story.findById(storyId);
        if (!storyDoc || !storyDoc.userHasAccess(socket.userId, 'editor')) {
          socket.emit('error', { message: 'Edit access denied' });
          return;
        }

        // Update story
        storyDoc.story = new Map(Object.entries(story));
        storyDoc.currentNodeId = currentNodeId;
        storyDoc.nextNodeId = nextNodeId;
        storyDoc.lastEditedBy = socket.userId;
        storyDoc.lastEditedAt = new Date();
        storyDoc.version += 1;

        await storyDoc.save();

        // Broadcast to other users in the story
        socket.to(`story-${storyId}`).emit('story-updated', {
          storyId,
          story: Object.fromEntries(storyDoc.story),
          currentNodeId: storyDoc.currentNodeId,
          nextNodeId: storyDoc.nextNodeId,
          version: storyDoc.version,
          lastEditedBy: socket.userId,
          lastEditedAt: storyDoc.lastEditedAt
        });

        console.log(`Story ${storyId} updated by ${socket.user.username}`);
      } catch (error) {
        console.error('Story update error:', error);
        socket.emit('error', { message: 'Error updating story' });
      }
    });

    // Handle cursor position updates
    socket.on('cursor-update', (data) => {
      const { storyId, position } = data;
      socket.to(`story-${storyId}`).emit('user-cursor-update', {
        userId: socket.userId,
        username: socket.user.username,
        avatar: socket.user.avatar,
        position
      });
    });

    // Handle typing indicators
    socket.on('typing-start', (storyId) => {
      socket.to(`story-${storyId}`).emit('user-typing', {
        userId: socket.userId,
        username: socket.user.username,
        isTyping: true
      });
    });

    socket.on('typing-stop', (storyId) => {
      socket.to(`story-${storyId}`).emit('user-typing', {
        userId: socket.userId,
        username: socket.user.username,
        isTyping: false
      });
    });

    // Handle user presence
    socket.on('user-presence', async (data) => {
      const { storyId, currentNodeId } = data;
      
      try {
        await Story.findByIdAndUpdate(storyId, {
          $pull: { activeUsers: { user: socket.userId } }
        });

        await Story.findByIdAndUpdate(storyId, {
          $push: { activeUsers: { user: socket.userId, currentNodeId } }
        });

        socket.to(`story-${storyId}`).emit('user-presence-update', {
          userId: socket.userId,
          username: socket.user.username,
          avatar: socket.user.avatar,
          currentNodeId
        });
      } catch (error) {
        console.error('User presence error:', error);
      }
    });

    // Handle disconnection
    socket.on('disconnect', async () => {
      console.log(`User disconnected: ${socket.user.username} (${socket.userId})`);

      // Update user offline status
      await User.findByIdAndUpdate(socket.userId, {
        isOnline: false,
        lastSeen: new Date()
      });

      // Remove from active users in all stories
      const userStories = await Story.find({
        $or: [
          { owner: socket.userId },
          { 'collaborators.user': socket.userId }
        ]
      });

      for (const story of userStories) {
        await story.removeActiveUser(socket.userId);
        
        // Notify other users
        socket.to(`story-${story._id}`).emit('user-left-story', {
          userId: socket.userId,
          username: socket.user.username
        });
      }

      socketUsers.delete(socket.id);
    });
  });

  // Make io available to routes
  // Note: io instance will be made available through the server setup
};

