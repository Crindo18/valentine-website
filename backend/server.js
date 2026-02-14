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
app.use(cors({
  origin: 'https://crindo18.github.io',
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
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

// Recording Schema - Updated for Photo
const recordingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  audioUrl: { type: String, required: true },
  audioPublicId: String,
  photoUrl: { type: String }, // New field for photo
  photoPublicId: String,      // New field for photo deletion
  uploadDate: { type: Date, default: Date.now },
  order: { type: Number, default: 0 }
});

const Recording = mongoose.model('Recording', recordingSchema);

const passwordSchema = new mongoose.Schema({
  hashedPassword: { type: String, required: true }
});

const Password = mongoose.model('Password', passwordSchema);

// Storage Config - Handles both Audio and Images
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Determine folder and resource type based on file field name
    if (file.fieldname === 'audio') {
      return {
        folder: 'valentine-audio',
        resource_type: 'video', // Cloudinary treats audio as video
        public_id: `audio-${Date.now()}`
      };
    } else {
      return {
        folder: 'valentine-photos',
        resource_type: 'image',
        public_id: `photo-${Date.now()}`
      };
    }
  },
});

const upload = multer({ storage: storage });

// Routes

// Verify Password (Dual Logic)
app.post('/api/verify-password', async (req, res) => {
  try {
    const { password } = req.body;
    
    // 1. Check if it's the ADMIN password (set this in your .env file)
    const adminPass = process.env.ADMIN_PASSWORD || 'admin123'; // Default fallback
    if (password === adminPass) {
      return res.json({ valid: true, role: 'admin' });
    }

    // 2. Check if it's the GIRLFRIEND password (from DB)
    const storedPassword = await Password.findOne();
    if (!storedPassword) {
      return res.status(404).json({ error: 'Password not set' });
    }
    
    const isValid = await bcrypt.compare(password, storedPassword.hashedPassword);
    if (isValid) {
      return res.json({ valid: true, role: 'user' });
    }

    res.json({ valid: false });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Set User Password
app.post('/api/set-password', async (req, res) => {
  try {
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await Password.deleteMany({});
    const newPassword = new Password({ hashedPassword });
    await newPassword.save();
    res.json({ message: 'Password set successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload Recording (Handles 2 files)
app.post('/api/recordings', upload.fields([{ name: 'audio', maxCount: 1 }, { name: 'photo', maxCount: 1 }]), async (req, res) => {
  try {
    const { title, description, order } = req.body;
    const files = req.files;

    if (!files.audio) return res.status(400).json({ message: 'Audio file is required' });

    const recording = new Recording({
      title,
      description,
      audioUrl: files.audio[0].path,
      audioPublicId: files.audio[0].filename,
      photoUrl: files.photo ? files.photo[0].path : null,
      photoPublicId: files.photo ? files.photo[0].filename : null,
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
    const recordings = await Recording.find().sort({ order: 1, uploadDate: -1 });
    res.json(recordings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete recording
app.delete('/api/recordings/:id', async (req, res) => {
  try {
    const recording = await Recording.findById(req.params.id);
    
    if (recording) {
      if (recording.audioPublicId) await cloudinary.uploader.destroy(recording.audioPublicId, { resource_type: 'video' });
      if (recording.photoPublicId) await cloudinary.uploader.destroy(recording.photoPublicId, { resource_type: 'image' });
      await Recording.findByIdAndDelete(req.params.id);
    }
    
    res.json({ message: 'Recording deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/valentine-response', async (req, res) => {
  try {
    console.log('Valentine response:', req.body.response);
    res.json({ message: 'Response recorded!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});