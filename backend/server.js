require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const bcrypt = require('bcrypt');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/valentine', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.log('❌ MongoDB connection error:', err));

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Recording Schema - now stores Cloudinary URL
const recordingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  url: { type: String, required: true }, // Cloudinary URL
  publicId: String, // Cloudinary public ID for deletion
  type: String, // 'audio', 'video', 'image'
  uploadDate: { type: Date, default: Date.now },
  order: { type: Number, default: 0 }
});

const Recording = mongoose.model('Recording', recordingSchema);

// Password Schema
const passwordSchema = new mongoose.Schema({
  hashedPassword: { type: String, required: true }
});

const Password = mongoose.model('Password', passwordSchema);

// Configure Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let resourceType = 'auto';
    if (file.mimetype.startsWith('audio')) resourceType = 'video'; // Cloudinary treats audio as video
    if (file.mimetype.startsWith('video')) resourceType = 'video';
    
    return {
      folder: 'valentine-memories',
      resource_type: resourceType,
      public_id: file.originalname.split('.')[0] + '-' + Date.now(),
    };
  },
});

const upload = multer({ storage: storage });

// Routes

// Set password (call this once to set up)
app.post('/api/set-password', async (req, res) => {
  try {
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Delete existing password and create new one
    await Password.deleteMany({});
    const newPassword = new Password({ hashedPassword });
    await newPassword.save();
    
    res.json({ message: 'Password set successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify password
app.post('/api/verify-password', async (req, res) => {
  try {
    const { password } = req.body;
    const storedPassword = await Password.findOne();
    
    if (!storedPassword) {
      return res.status(404).json({ error: 'Password not set' });
    }
    
    const isValid = await bcrypt.compare(password, storedPassword.hashedPassword);
    res.json({ valid: isValid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload recording
app.post('/api/recordings', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const { title, description, order } = req.body;
    
    // Determine type for frontend rendering
    let type = 'image';
    if (req.file.mimetype.startsWith('audio')) type = 'audio';
    if (req.file.mimetype.startsWith('video')) type = 'video';
    
    const recording = new Recording({
      title,
      description,
      url: req.file.path, // Cloudinary URL
      publicId: req.file.filename, // Cloudinary public ID
      type: type,
      order: order || 0
    });
    
    await recording.save();
    res.json(recording);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all recordings
app.get('/api/recordings', async (req, res) => {
  try {
    const recordings = await Recording.find().sort({ order: 1, uploadDate: 1 });
    res.json(recordings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete recording
app.delete('/api/recordings/:id', async (req, res) => {
  try {
    const recording = await Recording.findById(req.params.id);
    
    if (recording && recording.publicId) {
      // Delete from Cloudinary
      await cloudinary.uploader.destroy(recording.publicId, { resource_type: 'video' });
    }
    
    // Delete from MongoDB
    await Recording.findByIdAndDelete(req.params.id);
    res.json({ message: 'Recording deleted' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Valentine response tracking (optional)
app.post('/api/valentine-response', async (req, res) => {
  try {
    const { response } = req.body;
    console.log('Valentine response:', response);
    res.json({ message: 'Response recorded!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});