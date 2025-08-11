import { storiesAPI } from './api';

export const storyService = {
  // Get all stories for the current user
  getAllStories: async () => {
    try {
      const response = await storiesAPI.getAllStories();
      return { success: true, stories: response.stories };
    } catch (error) {
      console.error('Error fetching stories:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch stories' 
      };
    }
  },

  // Get a specific story
  getStory: async (storyId) => {
    try {
      const response = await storiesAPI.getStory(storyId);
      return { success: true, story: response.story };
    } catch (error) {
      console.error('Error fetching story:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch story' 
      };
    }
  },

  // Create a new story
  createStory: async (storyData) => {
    try {
      const response = await storiesAPI.createStory(storyData);
      return { success: true, story: response.story };
    } catch (error) {
      console.error('Error creating story:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to create story' 
      };
    }
  },

  // Update story content
  updateStoryContent: async (storyId, content) => {
    try {
      const response = await storiesAPI.updateStoryContent(storyId, content);
      return { success: true, version: response.version };
    } catch (error) {
      console.error('Error updating story:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to update story' 
      };
    }
  },

  // Delete a story
  deleteStory: async (storyId) => {
    try {
      await storiesAPI.deleteStory(storyId);
      return { success: true };
    } catch (error) {
      console.error('Error deleting story:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to delete story' 
      };
    }
  },

  // Convert local story format to backend format
  convertToBackendFormat: (story, currentNodeId, nextNodeId) => {
    return {
      story: Object.fromEntries(story),
      currentNodeId,
      nextNodeId
    };
  },

  // Convert backend story format to local format
  convertFromBackendFormat: (backendStory) => {
    return {
      story: new Map(Object.entries(backendStory.story)),
      currentNodeId: backendStory.currentNodeId,
      nextNodeId: backendStory.nextNodeId
    };
  }
};
