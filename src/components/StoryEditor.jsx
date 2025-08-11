import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { storyService } from '../services/storyService'

// Simple initial story
const initialStory = {
  "start": {
    id: "start",
    text: "Welcome to your collaborative story! Start writing your adventure here.",
    options: [],
    color: "#1e3c72"
  }
};

function StoryEditor({ storyId }) {
  const { user, logout } = useAuth();
  const [story, setStory] = useState(initialStory);
  const [currentNodeId, setCurrentNodeId] = useState("start");
  const [history, setHistory] = useState([]);
  const [nextNodeId, setNextNodeId] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const currentNode = story[currentNodeId];

  // Load story from backend
  useEffect(() => {
    if (storyId) {
      loadStory();
    } else {
      setLoading(false);
      setError('No story ID provided');
    }
  }, [storyId]);

  const loadStory = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Loading story with ID:', storyId);
      const result = await storyService.getStory(storyId);
      console.log('Story load result:', result);
      
      if (result.success) {
        const backendStory = result.story;
        const convertedStory = storyService.convertFromBackendFormat(backendStory);
        
        setStory(convertedStory.story);
        setCurrentNodeId(convertedStory.currentNodeId);
        setNextNodeId(convertedStory.nextNodeId);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to load story');
      console.error('Load story error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-save story changes
  useEffect(() => {
    if (!loading && storyId) {
      const saveTimeout = setTimeout(() => {
        saveStory();
      }, 2000); // Save after 2 seconds of inactivity

      return () => clearTimeout(saveTimeout);
    }
  }, [story, currentNodeId, nextNodeId, loading, storyId]);

  const saveStory = async () => {
    if (!storyId || saving) return;
    
    setSaving(true);
    
    try {
      const backendFormat = storyService.convertToBackendFormat(
        story, 
        currentNodeId, 
        nextNodeId
      );
      
      const result = await storyService.updateStoryContent(storyId, backendFormat);
      
      if (!result.success) {
        console.error('Save failed:', result.error);
      }
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  // Helper function to adjust color brightness
  const adjustColor = (color, amount) => {
    const hex = color.replace('#', '');
    const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount));
    const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount));
    const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  // Helper function to calculate text color based on background brightness
  const getTextColor = (backgroundColor) => {
    if (!backgroundColor) return '#f8f8f8';
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#ffffff';
  };

  // Auto-resize textarea
  const adjustHeight = (textarea) => {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 2 + 'px';
  };

  useEffect(() => {
    const textarea = document.querySelector('.story-text');
    if (textarea) {
      adjustHeight(textarea);
    }
  }, [currentNode.text]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '400px',
        color: '#666'
      }}>
        Loading story...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '400px',
        color: '#e74c3c',
        gap: '16px'
      }}>
        <p>Error loading story: {error}</p>
        <button 
          onClick={loadStory}
          style={{
            background: '#667eea',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div
      className="adventure-container"
      style={{
        background: currentNode.color ? `linear-gradient(135deg, ${currentNode.color} 0%, ${adjustColor(currentNode.color, 20)} 100%)` : 'rgba(255, 255, 255, 0.1)',
        minHeight: '100vh',
        padding: '20px'
      }}
    >
      {/* Header with save status */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px',
        color: getTextColor(currentNode.color)
      }}>
        <h1>Story Editor</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {saving && (
            <span style={{ fontSize: '14px', opacity: 0.8 }}>
              💾 Saving...
            </span>
          )}
          <span style={{ fontSize: '14px' }}>
            Welcome, {user?.username || 'User'}!
          </span>
        </div>
      </div>

      {/* Story content */}
      <div style={{ marginBottom: '20px' }}>
        <textarea
          className="story-text"
          value={currentNode.text || ""}
          placeholder="Write your story here..."
          onChange={(e) => {
            const newText = e.target.value;
            setStory(prev => ({
              ...prev,
              [currentNodeId]: {
                ...prev[currentNodeId],
                text: newText
              }
            }));
          }}
          onInput={(e) => adjustHeight(e.target)}
          style={{
            color: getTextColor(currentNode.color),
            background: 'rgba(255, 255, 255, 0.1)',
            border: `1px solid ${getTextColor(currentNode.color)}`,
            outline: 'none',
            resize: 'none',
            width: '100%',
            minHeight: '200px',
            padding: '16px',
            borderRadius: '8px',
            fontSize: '16px',
            lineHeight: '1.6'
          }}
        />
      </div>

      {/* Color picker */}
      <div style={{ 
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        color: getTextColor(currentNode.color)
      }}>
        <label htmlFor="node-color">Background Color:</label>
        <input
          type="color"
          id="node-color"
          value={currentNode.color || "#1e3c72"}
          onChange={(e) => {
            setStory(prev => ({
              ...prev,
              [currentNodeId]: {
                ...prev[currentNodeId],
                color: e.target.value
              }
            }));
          }}
          style={{
            border: `2px solid ${getTextColor(currentNode.color)}`,
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        />
      </div>

      {/* Status message */}
      <div style={{ 
        textAlign: 'center',
        color: getTextColor(currentNode.color),
        opacity: 0.8,
        fontSize: '14px'
      }}>
        <p>🎉 Backend integration is working! Your story is automatically saved to the database.</p>
        <p>Next steps: Add real-time collaboration features with Socket.IO.</p>
      </div>
    </div>
  );
}

export default StoryEditor;
