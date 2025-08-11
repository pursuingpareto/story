import { useState } from 'react';
import { storyService } from '../services/storyService';
import './CreateStory.css';

const CreateStory = ({ onStoryCreated, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    isPublic: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Story title is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const { confirmPassword, ...userData } = formData;
      console.log('Creating story with data:', userData);
      const result = await storyService.createStory(userData);
      console.log('Story creation result:', result);
      
      if (result.success) {
        onStoryCreated(result.story);
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('Story creation error:', error);
      setError('Failed to create story. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-story-overlay">
      <div className="create-story-modal">
        <div className="modal-header">
          <h2>Create New Story</h2>
          <button 
            className="close-btn"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="create-story-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="title">Story Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter your story title"
              required
              disabled={isSubmitting}
              maxLength={200}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your story (optional)"
              disabled={isSubmitting}
              maxLength={1000}
              rows={4}
            />
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              <span className="checkmark"></span>
              Make this story public
            </label>
            <small>Public stories can be discovered by other users</small>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="create-btn"
              disabled={isSubmitting || !formData.title.trim()}
            >
              {isSubmitting ? 'Creating...' : 'Create Story'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStory;
