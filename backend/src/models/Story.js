import mongoose from 'mongoose';

const storyNodeSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  text: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: '#1e3c72'
  },
  options: [{
    text: {
      type: String,
      required: true
    },
    nextId: {
      type: String,
      required: true
    }
  }]
}, { _id: false });

const storySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    maxlength: 1000,
    default: ''
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  collaborators: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['editor', 'viewer'],
      default: 'viewer'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  story: {
    type: Map,
    of: storyNodeSchema,
    default: new Map()
  },
  currentNodeId: {
    type: String,
    default: 'start'
  },
  nextNodeId: {
    type: Number,
    default: 1
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  version: {
    type: Number,
    default: 1
  },
  lastEditedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  lastEditedAt: {
    type: Date,
    default: Date.now
  },
  activeUsers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    currentNodeId: String,
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Index for better query performance
storySchema.index({ owner: 1, createdAt: -1 });
storySchema.index({ 'collaborators.user': 1 });
storySchema.index({ isPublic: 1, createdAt: -1 });
storySchema.index({ tags: 1 });

// Method to add collaborator
storySchema.methods.addCollaborator = function(userId, role = 'viewer') {
  const existingIndex = this.collaborators.findIndex(
    collab => collab.user.toString() === userId.toString()
  );
  
  if (existingIndex >= 0) {
    this.collaborators[existingIndex].role = role;
  } else {
    this.collaborators.push({ user: userId, role });
  }
  
  return this.save();
};

// Method to remove collaborator
storySchema.methods.removeCollaborator = function(userId) {
  this.collaborators = this.collaborators.filter(
    collab => collab.user.toString() !== userId.toString()
  );
  return this.save();
};

// Method to check if user has access
storySchema.methods.userHasAccess = function(userId, requiredRole = 'viewer') {
  if (this.owner.toString() === userId.toString()) return true;
  
  const collaborator = this.collaborators.find(
    collab => collab.user.toString() === userId.toString()
  );
  
  if (!collaborator) return false;
  
  const roleHierarchy = { viewer: 1, editor: 2 };
  return roleHierarchy[collaborator.role] >= roleHierarchy[requiredRole];
};

// Method to add active user
storySchema.methods.addActiveUser = function(userId, currentNodeId = null) {
  const existingIndex = this.activeUsers.findIndex(
    active => active.user.toString() === userId.toString()
  );
  
  if (existingIndex >= 0) {
    this.activeUsers[existingIndex].currentNodeId = currentNodeId;
    this.activeUsers[existingIndex].joinedAt = new Date();
  } else {
    this.activeUsers.push({ user: userId, currentNodeId });
  }
  
  return this.save();
};

// Method to remove active user
storySchema.methods.removeActiveUser = function(userId) {
  this.activeUsers = this.activeUsers.filter(
    active => active.user.toString() !== userId.toString()
  );
  return this.save();
};

export default mongoose.model('Story', storySchema);

