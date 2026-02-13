# Valentine's Website 💕

A heartfelt Valentine's Day website with voice recordings for your special someone!

## Features

- **Interactive Valentine Proposal**: Fun "Will you be my Valentine?" page where the "No" button runs away
- **Password-Protected Voice Recordings**: Upload and share personal voice messages
- **Admin Panel**: Easy interface to upload recordings and manage content
- **Responsive Design**: Works beautifully on all devices
- **Warm & Intimate Design**: Cozy, personal aesthetic

## Tech Stack

- **Frontend**: React
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Deployment**: GitHub Pages (frontend) + your choice for backend

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Git

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Edit `.env` and add your MongoDB connection string:
```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

5. Create an `uploads` directory:
```bash
mkdir uploads
```

6. Start the server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

### Setting Up the Password

1. Start both backend and frontend
2. Navigate to the Admin Panel (link at bottom of recordings page)
3. Use the "Set Access Password" section to create a password
4. Share this password with your girlfriend so she can access the recordings

### Uploading Voice Recordings

1. Go to the Admin Panel
2. Fill in the recording details:
   - **Title**: Name of the recording (e.g., "Good Morning Message")
   - **Description**: Optional sweet message about the recording
   - **Order**: Number to control playback order (0 = first)
   - **Audio File**: Upload your .mp3, .wav, or .m4a file
3. Click "Upload Recording"

## Deployment

### Backend Deployment

You can deploy the backend to:
- **Render**: https://render.com
- **Railway**: https://railway.app
- **Heroku**: https://heroku.com
- **DigitalOcean**: https://digitalocean.com

Make sure to:
1. Set environment variables (MONGODB_URI, PORT)
2. Update the frontend API URLs to point to your deployed backend

### Frontend Deployment (GitHub Pages)

1. Install gh-pages:
```bash
cd frontend
npm install --save-dev gh-pages
```

2. Add to `package.json`:
```json
"homepage": "https://yourusername.github.io/valentine-website",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}
```

3. Update API URLs in the components to point to your deployed backend

4. Deploy:
```bash
npm run deploy
```

5. Enable GitHub Pages in your repository settings

### Important: Update API URLs

Before deploying, update all `http://localhost:5000` URLs in:
- `ValentinePage.js`
- `RecordingsPage.js`
- `AdminPage.js`

Replace with your deployed backend URL (e.g., `https://your-app.onrender.com`)

## Project Structure

```
valentine-website/
├── backend/
│   ├── server.js          # Express server
│   ├── package.json
│   ├── .env.example
│   └── uploads/           # Voice recordings storage
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ValentinePage.js
    │   │   ├── ValentinePage.css
    │   │   ├── RecordingsPage.js
    │   │   ├── RecordingsPage.css
    │   │   ├── AdminPage.js
    │   │   └── AdminPage.css
    │   ├── App.js
    │   └── App.css
    └── package.json
```

## Customization Ideas

- Change color schemes in CSS files
- Add more animations
- Include photos alongside recordings
- Add a countdown timer to Valentine's Day
- Create additional pages with memories or letters

## Tips for Voice Recordings

- Record in a quiet environment
- Keep messages personal and heartfelt
- Consider recording:
  - Morning greetings
  - Bedtime messages
  - Reasons why you love her
  - Funny memories
  - Future plans together
  - Simple "I love you" messages

## Security Notes

- The password is hashed using bcrypt
- Make sure to use HTTPS in production
- Keep your MongoDB connection string secure
- Don't commit `.env` files to Git

## Troubleshooting

**Backend won't start:**
- Check if MongoDB is running
- Verify your `.env` file
- Make sure port 5000 is available

**Frontend can't connect to backend:**
- Ensure backend is running on port 5000
- Check for CORS issues
- Verify API URLs are correct

**File uploads failing:**
- Check the `uploads/` directory exists
- Verify file size limits
- Ensure audio file format is supported

## License

This is a personal project - feel free to customize it for your own Valentine! ❤️

---

Made with love for someone special 💕
