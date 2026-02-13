# Quick Start Guide 🚀

Follow these steps to get your Valentine's website running quickly!

## Step 1: Setup MongoDB

Choose one option:

### Option A: MongoDB Atlas (Recommended - Free & Easy)
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free account
3. Create a new cluster (choose the free tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database password

### Option B: Local MongoDB
1. Install MongoDB: https://www.mongodb.com/try/download/community
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/valentine`

## Step 2: Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
echo "MONGODB_URI=your_connection_string_here" > .env
echo "PORT=5000" >> .env

# Start the server
npm start
```

You should see: "Server running on port 5000" and "MongoDB connected"

## Step 3: Setup Frontend

Open a new terminal:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (if not already done)
npm install

# Start the development server
npm start
```

Your browser should open to http://localhost:3000

## Step 4: Set the Password

1. In your browser, go to the Valentine page
2. Click "Listen to something special" (after clicking Yes)
3. Click "Admin Panel" at the bottom
4. Use "Set Access Password" to create a password for your girlfriend
5. Remember this password to share with her!

## Step 5: Upload Your First Recording

1. In the Admin Panel, scroll to "Upload Voice Recording"
2. Fill in:
   - Title: "My First Message"
   - Description: "Something sweet"
   - Order: 0
   - Choose your audio file
3. Click "Upload Recording"

## Step 6: Test It Out!

1. Go back to the Valentine page
2. Click through to the recordings page
3. Enter the password you set
4. Listen to your recording!

## Next Steps

- Record more messages for her
- Customize the colors and text in the CSS files
- Deploy to make it accessible online

## Common Issues

**"Cannot connect to MongoDB"**
- Check your connection string in .env
- Make sure MongoDB service is running
- Verify your IP address is whitelisted (Atlas)

**"Backend not responding"**
- Make sure backend is running (npm start in backend folder)
- Check if port 5000 is in use

**"File upload fails"**
- Ensure the uploads/ folder exists
- Check file format (mp3, wav, m4a supported)
- Try a smaller file size

## Ready to Deploy?

See the main README.md for full deployment instructions!

Happy Valentine's Day! 💕
