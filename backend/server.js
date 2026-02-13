require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/valentine', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Recording Schema
const recordingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  filename: { type: String, required: true },
  originalName: String,
  uploadDate: { type: Date, default: Date.now },
  order: { type: Number, default: 0 }
});

const Recording = mongoose.model('Recording', recordingSchema);

// Password Schema (for simple auth)
const passwordSchema = new mongoose.Schema({
  hashedPassword: { type: String, required: true }
});

const Password = mongoose.model('Password', passwordSchema);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /mp3|wav|m4a|ogg|webm/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed!'));
    }
  }
});

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
    const { title, description, order } = req.body;
    
    const recording = new Recording({
      title,
      description,
      filename: req.file.filename,
      originalName: req.file.originalname,
      order: order || 0
    });
    
    await recording.save();
    res.json(recording);
  } catch (error) {
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
    await Recording.findByIdAndDelete(req.params.id);
    res.json({ message: 'Recording deleted' });
  } catch (error) {
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
