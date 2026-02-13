# Deployment Guide 🌐

## Overview

You'll need to deploy two parts:
1. **Backend** (Node.js/Express) - Needs to run 24/7 and handle file uploads
2. **Frontend** (React) - Can be hosted on GitHub Pages

## Part 1: Deploy Backend

### Recommended: Render.com (Free Tier Available)

1. **Create a Render account**: https://render.com

2. **Create a New Web Service**:
   - Connect your GitHub repository
   - Or use "Deploy via Git"
   - Root directory: `backend`
   - Build command: `npm install`
   - Start command: `npm start`

3. **Set Environment Variables**:
   - Go to "Environment" tab
   - Add: `MONGODB_URI` = your MongoDB connection string
   - Add: `PORT` = 5000 (or leave empty to use Render's default)

4. **Deploy**: Click "Create Web Service"

5. **Note your backend URL**: Something like `https://valentine-backend.onrender.com`

### Alternative: Railway.app

1. Sign up at https://railway.app
2. New Project → Deploy from GitHub
3. Add MongoDB plugin (or use MongoDB Atlas)
4. Set environment variables
5. Deploy!

### Alternative: Heroku

```bash
# Install Heroku CLI
cd backend
heroku create your-app-name
heroku config:set MONGODB_URI=your_connection_string
git push heroku main
```

## Part 2: Deploy Frontend to GitHub Pages

### Step 1: Update API URLs

Replace all instances of `http://localhost:5000` with your deployed backend URL in:

**frontend/src/components/ValentinePage.js:**
```javascript
// Line ~20
await fetch('YOUR_BACKEND_URL/api/valentine-response', {
```

**frontend/src/components/RecordingsPage.js:**
```javascript
// Line ~17
const response = await fetch('YOUR_BACKEND_URL/api/recordings');

// Line ~29
const response = await fetch('YOUR_BACKEND_URL/api/verify-password', {

// Line ~69
src={`YOUR_BACKEND_URL/uploads/${recording.filename}`}
```

**frontend/src/components/AdminPage.js:**
```javascript
// Line ~18
const response = await fetch('YOUR_BACKEND_URL/api/recordings');

// Line ~46
const response = await fetch('YOUR_BACKEND_URL/api/recordings', {

// Line ~70
const response = await fetch(`YOUR_BACKEND_URL/api/recordings/${id}`, {

// Line ~93
const response = await fetch('YOUR_BACKEND_URL/api/set-password', {
```

### Step 2: Install gh-pages

```bash
cd frontend
npm install --save-dev gh-pages
```

### Step 3: Update package.json

Add to `frontend/package.json`:

```json
{
  "name": "valentine-website",
  "version": "0.1.0",
  "homepage": "https://YOUR_GITHUB_USERNAME.github.io/valentine-website",
  "private": true,
  "dependencies": {
    ...
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

### Step 4: Deploy to GitHub

```bash
# Make sure you're in the frontend directory
cd frontend

# Build and deploy
npm run deploy
```

### Step 5: Configure GitHub Repository

1. Go to your GitHub repository
2. Settings → Pages
3. Source: `gh-pages` branch
4. Save

Your site will be live at: `https://YOUR_USERNAME.github.io/valentine-website`

## Part 3: Test Everything

1. Visit your GitHub Pages URL
2. Try the Valentine page interaction
3. Set a password in the Admin Panel
4. Upload a test recording
5. Access the recordings page with the password
6. Verify audio playback works

## Custom Domain (Optional)

### Frontend (GitHub Pages):
1. Buy a domain (e.g., from Namecheap, Google Domains)
2. Add a `CNAME` file to `frontend/public/` with your domain
3. Configure DNS settings in your domain provider
4. Wait for DNS propagation (up to 24 hours)

### Backend (Render):
1. Go to your Render service settings
2. Custom Domains → Add your domain
3. Update DNS records as instructed

## Environment Variables Checklist

**Backend:**
- ✅ MONGODB_URI
- ✅ PORT (optional, platform provides default)

**Frontend:**
- ✅ API URLs updated to production backend
- ✅ homepage in package.json

## Security Checklist

- ✅ `.env` file in `.gitignore`
- ✅ MongoDB credentials not exposed
- ✅ HTTPS enabled (automatic on Render/GitHub Pages)
- ✅ CORS configured correctly

## Cost Breakdown

**Free Tier:**
- MongoDB Atlas: Free (512 MB)
- Render: Free (sleeps after 15 min inactivity)
- GitHub Pages: Free
- **Total: $0/month**

**Paid Recommendations:**
- MongoDB Atlas (Shared): ~$9/month
- Render Starter: $7/month (no sleep)
- Custom domain: ~$12/year
- **Total: ~$16-20/month**

## Troubleshooting

**"Backend sleeps on Render free tier"**
- Upgrade to paid tier, or
- Use Railway/Heroku, or
- Accept 30-second wake-up time on first request

**"CORS errors"**
- Make sure backend has proper CORS configuration
- Verify frontend URL is allowed in backend

**"Uploads not persisting"**
- Render's free tier has ephemeral storage
- Consider using cloud storage (AWS S3, Cloudinary) for uploads
- Or upgrade to Render paid tier

**"Audio files too large"**
- Compress audio files before uploading
- Use .m4a or .ogg format for smaller sizes
- Recommended: < 5 MB per file

## Update Process

When you make changes:

```bash
# Backend
git push # Render auto-deploys from Git

# Frontend
cd frontend
npm run deploy
```

## Monitoring

**Render Dashboard:** Check logs and uptime
**MongoDB Atlas:** Monitor database usage
**GitHub Actions:** Check deployment status

---

Need help? Check the main README.md or create an issue!

💕 Good luck with your Valentine's website!
