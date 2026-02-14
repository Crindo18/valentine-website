import React, { useState, useEffect } from 'react';
import './RecordingsPage.css';
import API_URL from '../config';

const RecordingsPage = ({ onNavigate, isAuthenticated, setIsAuthenticated }) => {
  const [password, setPassword] = useState('');
  const [recordings, setRecordings] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [playingId, setPlayingId] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchRecordings();
    }
  }, [isAuthenticated]);

  const fetchRecordings = async () => {
    try {
      const response = await fetch(`${API_URL}/api/recordings`);
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
      const response = await fetch(`${API_URL}/api/verify-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (data.valid) {
        if (data.role === 'admin') {
          // Redirect to Admin Panel if admin password is used
          onNavigate('admin');
        } else {
          // Unlock recordings if user password is used
          setIsAuthenticated(true);
          setPassword('');
        }
      } else {
        setError('Incorrect password. Try again! 💕');
      }
    } catch (error) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = (audioId) => {
    const audio = document.getElementById(`audio-${audioId}`);
    
    // Pause currently playing if different
    if (playingId && playingId !== audioId) {
      const current = document.getElementById(`audio-${playingId}`);
      if (current) current.pause();
    }

    if (audio.paused) {
      audio.play();
      setPlayingId(audioId);
    } else {
      audio.pause();
      setPlayingId(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="recordings-container">
        <div className="password-card">
          <button className="back-button" onClick={() => onNavigate('valentine')}>← Back</button>
          <div className="password-content">
            <h1 className="password-title">Locked Area 🔒</h1>
            <p className="password-subtitle">Enter the magic word to enter.</p>
            <form onSubmit={handlePasswordSubmit} className="password-form">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="password-input"
                autoFocus
              />
              <button type="submit" className="password-submit" disabled={loading}>
                {loading ? 'Checking...' : 'Enter'}
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
      <button className="back-button" onClick={() => onNavigate('valentine')}>← Back</button>
      
      <h1 className="gallery-title">Our Memories 📸</h1>
      
      <div className="photo-grid">
        {recordings.map((rec) => (
          <div key={rec._id} className="polaroid-card" onMouseEnter={() => {}} onMouseLeave={() => {}}>
            <div className="photo-frame">
              {/* If no photo is uploaded, use a placeholder gradient or default image */}
              {rec.photoUrl ? (
                <img src={rec.photoUrl} alt={rec.title} className="memory-photo" />
              ) : (
                <div className="placeholder-photo">🎵</div>
              )}
              
              <div className="play-overlay" onClick={() => handlePlay(rec._id)}>
                <span className="play-icon">
                  {playingId === rec._id ? '⏸' : '▶'}
                </span>
              </div>
            </div>
            
            <div className="card-caption">
              <h3>{rec.title}</h3>
              <p>{rec.description}</p>
            </div>
            
            <audio id={`audio-${rec._id}`} src={rec.audioUrl} onEnded={() => setPlayingId(null)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecordingsPage;