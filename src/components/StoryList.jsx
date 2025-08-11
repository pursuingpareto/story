import { useState, useEffect } from 'react';
import { storyService } from '../services/storyService';
import './StoryList.css';

const StoryList = ({ onSelectStory, onCreateNew }) => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    setLoading(true);
    setError(null);
    
    const result = await storyService.getAllStories();
    console.log('Stories API result:', result);
    
    if (result.success) {
      console.log('Setting stories:', result.stories);
      setStories(result.stories);
    } else {
      console.error('Failed to load stories:', result.error);
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleDeleteStory = async (storyId, storyTitle) => {
    if (!confirm(`Are you sure you want to delete "${storyTitle}"?`)) {
      return;
    }

    const result = await storyService.deleteStory(storyId);
    
    if (result.success) {
      setStories(stories.filter(story => story._id !== storyId));
    } else {
      alert(`Failed to delete story: ${result.error}`);
    }
  };

  if (loading) {
    return (
      <div className="story-list-container">
        <div className="loading">Loading your stories...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="story-list-container">
        <div className="error">
          <p>Error loading stories: {error}</p>
          <button onClick={loadStories}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="story-list-container">
      <div className="story-list-header">
        <h2>Your Stories</h2>
        <button 
          className="create-story-btn"
          onClick={onCreateNew}
        >
          + Create New Story
        </button>
      </div>

      {stories.length === 0 ? (
        <div className="empty-state">
          <h3>No stories yet</h3>
          <p>Create your first collaborative story to get started!</p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              className="create-story-btn"
              onClick={onCreateNew}
            >
              Create Your First Story
            </button>
            <button 
              className="create-story-btn"
              style={{ background: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)' }}
              onClick={async () => {
                console.log('Creating test story...');
                const testStoryData = {
                  title: 'Test Story',
                  description: 'This is a test story to verify the system works',
                  isPublic: false
                };
                const result = await storyService.createStory(testStoryData);
                console.log('Test story creation result:', result);
                if (result.success) {
                  // Reload stories
                  loadStories();
                } else {
                  alert(`Failed to create test story: ${result.error}`);
                }
              }}
            >
              🧪 Create Test Story
            </button>
          </div>
        </div>
      ) : (
        <div className="story-grid">
          {stories.map(story => (
            <div key={story._id} className="story-card">
              <div className="story-card-header">
                <h3>{story.title}</h3>
                <div className="story-actions">
                  <button
                    className="edit-btn"
                    onClick={() => onSelectStory(story._id)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteStory(story._id, story.title)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <p className="story-description">
                {story.description || 'No description'}
              </p>
              
              <div className="story-meta">
                <span className="story-role">
                  {story.userRole === 'owner' ? '👑 Owner' : '👥 Collaborator'}
                </span>
                <span className="story-updated">
                  {new Date(story.updatedAt).toLocaleDateString()}
                </span>
              </div>
              
              {story.activeUsers > 0 && (
                <div className="active-users">
                  👥 {story.activeUsers} active user{story.activeUsers !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StoryList;
