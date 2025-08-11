import { useState } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import StoryList from './components/StoryList'
import StoryEditor from './components/StoryEditor'
import CreateStory from './components/CreateStory'
import './App.css'

// Main App component with authentication
function App() {
  return (
    <AuthProvider>
      <div className="app">
        <ProtectedRoute>
          <StoryApp />
        </ProtectedRoute>
      </div>
    </AuthProvider>
  );
}

// Story App component that manages the main application state
function StoryApp() {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState('list'); // 'list', 'editor', 'create'
  const [currentStoryId, setCurrentStoryId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleSelectStory = (storyId) => {
    console.log('Selecting story:', storyId);
    setCurrentStoryId(storyId);
    setCurrentView('editor');
  };

  const handleCreateNew = () => {
    console.log('Opening create story modal');
    setShowCreateModal(true);
  };

  const handleStoryCreated = (story) => {
    console.log('Story created:', story);
    setCurrentStoryId(story.id);
    setCurrentView('editor');
    setShowCreateModal(false);
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setCurrentStoryId(null);
  };

  const handleCancelCreate = () => {
    setShowCreateModal(false);
  };

  return (
    <div className="story-app">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1 
            className="app-title"
            onClick={() => setCurrentView('list')}
            style={{ cursor: 'pointer' }}
          >
            Collaborative Stories
          </h1>
          
          <div className="user-info">
            <span>Welcome, {user?.username || 'User'}!</span>
            <button onClick={logout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        {/* Debug info */}
        <div style={{ 
          background: '#f0f0f0', 
          padding: '10px', 
          margin: '10px', 
          borderRadius: '4px', 
          fontSize: '12px',
          fontFamily: 'monospace'
        }}>
          Debug: currentView={currentView}, currentStoryId={currentStoryId}, showCreateModal={showCreateModal.toString()}
        </div>
        
        {currentView === 'list' && (
          <StoryList 
            onSelectStory={handleSelectStory}
            onCreateNew={handleCreateNew}
          />
        )}
        
        {currentView === 'editor' && currentStoryId && (
          <div className="editor-container">
            <div className="editor-header">
              <button 
                onClick={handleBackToList}
                className="back-btn"
              >
                ← Back to Stories
              </button>
            </div>
            <StoryEditor storyId={currentStoryId} />
          </div>
        )}
      </main>

      {/* Create Story Modal */}
      {showCreateModal && (
        <CreateStory
          onStoryCreated={handleStoryCreated}
          onCancel={handleCancelCreate}
        />
      )}
    </div>
  );
}

export default App
