

const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://valentine-website-up3m.onrender.com'
  : 'http://localhost:5000';

export default API_URL;