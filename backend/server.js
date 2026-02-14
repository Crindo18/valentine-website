require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const jwt = require('jsonwebtoken');

const app = express();

// 1. Middleware
app.use(cors());
app.use(express.json());

// 2. Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// 3. Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 4. Storage Engine (Multer + Cloudinary)
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Determine resource type based on file mimetype
    let resource_type = 'auto'; // Default
    if (file.mimetype.startsWith('audio')) resource_type = 'video'; // Cloudinary treats audio as video
    if (file.mimetype.startsWith('video')) resource_type = 'video';
    
    return {
      folder: 'valentine-memories',
      resource_type: resource_type,
      public_id: file.originalname.split('.')[0] + '-' + Date.now(),
    };
  },
});

const upload = multer({ storage: storage });

// 5. Database Model
const RecordingSchema = new mongoose.Schema({
  title: String,
  url: String, // The Cloudinary URL
  type: String, // 'audio', 'video', 'image'
  createdAt: { type: Date, default: Date.now },
});
const Recording = mongoose.model('Recording', RecordingSchema);

// --- ROUTES ---

// Login Route (Simple password check)
app.post('/api/login', (req, res) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD) {
    // Create a token that lasts 24 hours
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ success: true, token });
  } else {
    res.status(401).json({ success: false, message: 'Incorrect password' });
  }
});

// Upload Route (Protected)
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    // Determine type for frontend to render correctly
    let type = 'image';
    if (req.file.mimetype.startsWith('audio')) type = 'audio';
    if (req.file.mimetype.startsWith('video')) type = 'video';

    const newRecording = new Recording({
      title: req.body.title || 'Untitled Memory',
      url: req.file.path, // Cloudinary URL
      type: type
    });

    await newRecording.save();
    res.json({ success: true, recording: newRecording });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Upload failed' });
  }
});

// Get All Recordings
app.get('/api/recordings', async (req, res) => {
  try {
    const recordings = await Recording.find().sort({ createdAt: -1 }); // Newest first
    res.json(recordings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recordings' });
  }
});

// Valentine Response (The Yes button)
app.post('/api/valentine-response', (req, res) => {
    console.log("YEHEYYY");
    // You could add code here to send yourself an email if you want
    res.json({ success: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));