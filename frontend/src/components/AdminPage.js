import React, { useState, useEffect } from 'react';
import './AdminPage.css';
import API_URL from '../config';

const AdminPage = ({ onNavigate }) => {
  const [recordings, setRecordings] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [settingPassword, setSettingPassword] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    order: 0,
    file: null
  });
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchRecordings();
  }, []);

  const fetchRecordings = async () => {
    try {
      const response = await fetch(`${API_URL}/api/recordings`);
      const data = await response.json();
      setRecordings(data);
    } catch (error) {
      console.error('Error fetching recordings:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      file: e.target.files[0]
    }));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!formData.file || !formData.title) {
      setMessage('Please provide both a title and an audio file');
      return;
    }

    setUploading(true);
    setMessage('');

    const uploadData = new FormData();
    uploadData.append('audio', formData.file);
    uploadData.append('title', formData.title);
    uploadData.append('description', formData.description);
    uploadData.append('order', formData.order);

    try {
      const response = await fetch(`${API_URL}/api/recordings`, {
        method: 'POST',
        body: uploadData
      });

      if (response.ok) {
        setMessage('Recording uploaded successfully! 🎉');
        setFormData({
          title: '',
          description: '',
          order: 0,
          file: null
        });
        // Reset file input
        document.getElementById('file-input').value = '';
        fetchRecordings();
      } else {
        setMessage('Failed to upload recording');
      }
    } catch (error) {
      setMessage('Error uploading recording');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this recording?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/recordings/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setMessage('Recording deleted');
        fetchRecordings();
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSetPassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage('Passwords do not match!');
      return;
    }

    if (passwordData.newPassword.length < 4) {
      setMessage('Password must be at least 4 characters');
      return;
    }

    setSettingPassword(true);
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/api/set-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordData.newPassword })
      });

      if (response.ok) {
        setMessage('Password set successfully! 🔐');
        setPasswordData({ newPassword: '', confirmPassword: '' });
      } else {
        setMessage('Failed to set password');
      }
    } catch (error) {
      setMessage('Error setting password');
      console.error('Password error:', error);
    } finally {
      setSettingPassword(false);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-card">
        <button 
          className="back-button"
          onClick={() => onNavigate('valentine')}
        >
          ← Back to Valentine
        </button>

        <h1 className="admin-title">Admin Panel</h1>
        
        {message && (
          <div className={`message ${message.includes('successfully') || message.includes('🎉') || message.includes('🔐') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        {/* Password Section */}
        <section className="admin-section">
          <h2 className="section-title">Set Access Password</h2>
          <p className="section-description">
            Set the password your girlfriend will use to access the recordings
          </p>
          
          <form onSubmit={handleSetPassword} className="password-form">
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              placeholder="New Password"
              className="admin-input"
            />
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="Confirm Password"
              className="admin-input"
            />
            <button 
              type="submit" 
              className="admin-button primary"
              disabled={settingPassword}
            >
              {settingPassword ? 'Setting...' : 'Set Password'}
            </button>
          </form>
        </section>

        {/* Upload Section */}
        <section className="admin-section">
          <h2 className="section-title">Upload Voice Recording</h2>
          
          <form onSubmit={handleUpload} className="upload-form">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Title (e.g., 'Good Morning Message')"
              className="admin-input"
              required
            />
            
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Description (optional)"
              className="admin-textarea"
              rows="3"
            />
            
            <input
              type="number"
              name="order"
              value={formData.order}
              onChange={handleInputChange}
              placeholder="Order (0 = first)"
              className="admin-input small"
            />
            
            <div className="file-input-wrapper">
              <input
                id="file-input"
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="file-input"
                required
              />
              <label htmlFor="file-input" className="file-label">
                {formData.file ? formData.file.name : 'Choose audio file'}
              </label>
            </div>
            
            <button 
              type="submit" 
              className="admin-button primary"
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Upload Recording'}
            </button>
          </form>
        </section>

        {/* Recordings List */}
        <section className="admin-section">
          <h2 className="section-title">Existing Recordings</h2>
          
          {recordings.length === 0 ? (
            <p className="no-recordings">No recordings yet</p>
          ) : (
            <div className="recordings-grid">
              {recordings.map((recording) => (
                <div key={recording._id} className="recording-card">
                  <h3>{recording.title}</h3>
                  {recording.description && <p>{recording.description}</p>}
                  <div className="recording-meta">
                    <span>Order: {recording.order}</span>
                    <span>{new Date(recording.uploadDate).toLocaleDateString()}</span>
                  </div>
                  <button 
                    onClick={() => handleDelete(recording._id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="admin-footer">
          <button 
            onClick={() => onNavigate('recordings')}
            className="admin-button"
          >
            View Recordings Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
