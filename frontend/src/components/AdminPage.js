import React, { useState, useEffect } from 'react';
import './AdminPage.css';
import API_URL from '../config';

const AdminPage = ({ onNavigate }) => {
  const [recordings, setRecordings] = useState([]);
  const [uploading, setUploading] = useState(false);
  
  // State for Uploading
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    order: 0,
    audioFile: null,
    photoFile: null
  });

  // State for Setting Password
  const [passwordData, setPasswordData] = useState({ newPassword: '', confirmPassword: '' });
  const [settingPassword, setSettingPassword] = useState(false);
  
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: files[0] }));
  };

  // --- PASSWORD HANDLERS ---
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSetPassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage('Passwords do not match!');
      return;
    }

    setSettingPassword(true);
    try {
      const response = await fetch(`${API_URL}/api/set-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordData.newPassword })
      });

      if (response.ok) {
        setMessage('Her password has been updated! 🔐');
        setPasswordData({ newPassword: '', confirmPassword: '' });
      } else {
        setMessage('Failed to update password');
      }
    } catch (error) {
      setMessage('Error setting password');
    } finally {
      setSettingPassword(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!formData.audioFile || !formData.title) {
      setMessage('Please provide title and audio file');
      return;
    }

    setUploading(true);
    const uploadData = new FormData();
    uploadData.append('audio', formData.audioFile);
    if (formData.photoFile) uploadData.append('photo', formData.photoFile);
    uploadData.append('title', formData.title);
    uploadData.append('description', formData.description);
    uploadData.append('order', formData.order);

    try {
      const response = await fetch(`${API_URL}/api/recordings`, {
        method: 'POST',
        body: uploadData
      });

      if (response.ok) {
        setMessage('Uploaded successfully! 🎉');
        setFormData({ title: '', description: '', order: 0, audioFile: null, photoFile: null });
        document.querySelectorAll('input[type="file"]').forEach(input => input.value = '');
        fetchRecordings();
      } else {
        setMessage('Failed to upload');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setMessage('Error uploading');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this memory?')) return;
    try {
      await fetch(`${API_URL}/api/recordings/${id}`, { method: 'DELETE' });
      fetchRecordings();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-card">
        <button className="back-button" onClick={() => onNavigate('valentine')}>← Home</button>
        <h1 className="admin-title">Admin Dashboard</h1>
        
        {message && <div className="message">{message}</div>}

        {/* --- PASSWORD SECTION --- */}
        <section className="admin-section">
          <h2 className="section-title">Set Her Access Password</h2>
          <form onSubmit={handleSetPassword} className="password-form-admin" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <input 
              type="password" 
              name="newPassword" 
              value={passwordData.newPassword} 
              onChange={handlePasswordChange} 
              placeholder="New Password for Her" 
              className="admin-input" 
            />
            <input 
              type="password" 
              name="confirmPassword" 
              value={passwordData.confirmPassword} 
              onChange={handlePasswordChange} 
              placeholder="Confirm" 
              className="admin-input" 
            />
            <button type="submit" className="admin-button" disabled={settingPassword}>
              {settingPassword ? 'Saving...' : 'Set Password'}
            </button>
          </form>
        </section>

        <section className="admin-section">
          <h2 className="section-title">Upload New Memory</h2>
          <form onSubmit={handleUpload} className="upload-form">
            <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="Title" className="admin-input" required />
            <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Description" className="admin-textarea" rows="2" />
            <input type="number" name="order" value={formData.order} onChange={handleInputChange} placeholder="Order" className="admin-input small" />
            
            <div className="file-input-group">
              <label>Audio File:</label>
              <input type="file" name="audioFile" accept="audio/*" onChange={handleFileChange} required />
            </div>

            <div className="file-input-group">
              <label>Cover Photo (Optional):</label>
              <input type="file" name="photoFile" accept="image/*" onChange={handleFileChange} />
            </div>

            <button type="submit" className="admin-button primary" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload Memory'}
            </button>
          </form>
        </section>

        <section className="admin-section">
          <h2 className="section-title">Existing Memories</h2>
          <div className="recordings-list-admin">
            {recordings.map((rec) => (
              <div key={rec._id} className="admin-recording-item">
                {rec.photoUrl && <img src={rec.photoUrl} alt="cover" className="admin-thumb" />}
                <div className="admin-rec-info">
                  <strong>{rec.title}</strong>
                  <span>{new Date(rec.uploadDate).toLocaleDateString()}</span>
                </div>
                <button onClick={() => handleDelete(rec._id)} className="delete-btn">×</button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminPage;