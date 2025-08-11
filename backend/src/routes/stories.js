import express from 'express';
import { body, validationResult } from 'express-validator';
import Story from '../models/Story.js';
import User from '../models/User.js';

const router = express.Router();

// Get all stories for current user
router.get('/', async (req, res) => {
  try {
    const userId = req.user._id;
    const stories = await Story.find({
      $or: [{ owner: userId }, { 'collaborators.user': userId }]
    })
    .populate('owner', 'username avatar')
    .populate('collaborators.user', 'username avatar')
    .sort({ updatedAt: -1 });

    res.json({ stories: stories });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stories' });
  }
});

// Create new story
router.post('/', async (req, res) => {
  try {
    const { title, description, isPublic = false, tags = [] } = req.body;
    const userId = req.user._id;

    const story = new Story({
      title,
      description,
      owner: userId,
      isPublic,
      tags,
      story: new Map([['start', { id: 'start', text: '', color: '#1e3c72', options: [] }]])
    });

    await story.save();
    await User.findByIdAndUpdate(userId, { $push: { stories: story._id } });

    res.status(201).json({ message: 'Story created', story });
  } catch (error) {
    res.status(500).json({ message: 'Error creating story' });
  }
});

// Get specific story
router.get('/:storyId', async (req, res) => {
  try {
    const { storyId } = req.params;
    const userId = req.user._id;

    const story = await Story.findById(storyId)
      .populate('owner', 'username avatar')
      .populate('collaborators.user', 'username avatar');

    if (!story || !story.userHasAccess(userId)) {
      return res.status(404).json({ message: 'Story not found or access denied' });
    }

    await story.addActiveUser(userId, story.currentNodeId);

    res.json({ story });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching story' });
  }
});

// Update story content
router.patch('/:storyId/content', async (req, res) => {
  try {
    const { storyId } = req.params;
    const userId = req.user._id;
    const { story, currentNodeId, nextNodeId } = req.body;

    const storyDoc = await Story.findById(storyId);
    if (!storyDoc || !storyDoc.userHasAccess(userId, 'editor')) {
      return res.status(403).json({ message: 'Access denied' });
    }

    storyDoc.story = new Map(Object.entries(story));
    storyDoc.currentNodeId = currentNodeId;
    storyDoc.nextNodeId = nextNodeId;
    storyDoc.lastEditedBy = userId;
    storyDoc.lastEditedAt = new Date();
    storyDoc.version += 1;

    await storyDoc.save();

    req.app.get('io').to(`story-${storyId}`).emit('story-updated', {
      storyId,
      story: Object.fromEntries(storyDoc.story),
      currentNodeId: storyDoc.currentNodeId,
      nextNodeId: storyDoc.nextNodeId,
      version: storyDoc.version
    });

    res.json({ message: 'Story updated', version: storyDoc.version });
  } catch (error) {
    res.status(500).json({ message: 'Error updating story' });
  }
});

// Delete story
router.delete('/:storyId', async (req, res) => {
  try {
    const { storyId } = req.params;
    const userId = req.user._id;

    const story = await Story.findById(storyId);
    if (!story || !story.owner.equals(userId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Story.findByIdAndDelete(storyId);
    await User.findByIdAndUpdate(userId, { $pull: { stories: storyId } });

    res.json({ message: 'Story deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting story' });
  }
});

export default router;
