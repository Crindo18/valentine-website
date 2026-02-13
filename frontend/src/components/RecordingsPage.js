import React, { useState, useEffect } from 'react';
import './RecordingsPage.css';

const RecordingsPage = ({ onNavigate, isAuthenticated, setIsAuthenticated }) => {
  const [password, setPassword] = useState('');
  const [recordings, setRecordings] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchRecordings();
    }
  }, [isAuthenticated]);

  const fetchRecordings = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/recordings');
      const data = await response.json();
      setRecordings(data);
    } catch (error) {
      console.error('Error fetching recordings:', error);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (data.valid) {
        setIsAuthenticated(true);
        setPassword('');
      } else {
        setError('Incorrect password. Try again! 💕');
        setPassword('');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPause = (recordingId) => {
    if (currentlyPlaying === recordingId) {
      setCurrentlyPlaying(null);
    } else {
      setCurrentlyPlaying(recordingId);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="recordings-container">
        <div className="password-card">
          <button 
            className="back-button"
            onClick={() => onNavigate('valentine')}
          >
            ← Back
          </button>
          
          <div className="password-content">
            <h1 className="password-title">Something Special Awaits 💝</h1>
            <p className="password-subtitle">
              I've left you some messages from my heart.<br/>
              Enter the password to unlock them.
            </p>
            
            <form onSubmit={handlePasswordSubmit} className="password-form">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="password-input"
                disabled={loading}
              />
              <button 
                type="submit" 
                className="password-submit"
                disabled={loading}
              >
                {loading ? 'Checking...' : 'Unlock 🔓'}
              </button>
              {error && <p className="error-message">{error}</p>}
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="recordings-container authenticated">
      <div className="recordings-card">
        <button 
          className="back-button"
          onClick={() => onNavigate('valentine')}
        >
          ← Back
        </button>
        
        <div className="recordings-header">
          <h1 className="recordings-title">Messages From My Heart 💕</h1>
          <p className="recordings-intro">
            I recorded these just for you. Take your time and listen whenever you want to hear my voice.
          </p>
        </div>

        <div className="recordings-list">
          {recordings.length === 0 ? (
            <p className="no-recordings">
              No recordings yet. Check back soon! 💝
            </p>
          ) : (
            recordings.map((recording) => (
              <div key={recording._id} className="recording-item">
                <div className="recording-info">
                  <h3 className="recording-title">{recording.title}</h3>
                  {recording.description && (
                    <p className="recording-description">{recording.description}</p>
                  )}
                  <p className="recording-date">
                    {new Date(recording.uploadDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                
                <div className="recording-player">
                  <audio
                    controls
                    src={`http://localhost:5000/uploads/${recording.filename}`}
                    onPlay={() => handlePlayPause(recording._id)}
                    onPause={() => setCurrentlyPlaying(null)}
                  >
                    Your browser does not support the audio element.
                  </audio>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="admin-link">
          <button 
            onClick={() => onNavigate('admin')}
            className="admin-button"
          >
            Admin Panel
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecordingsPage;
