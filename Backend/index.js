const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();

const fs = require('fs');
console.log('ENV FILE EXISTS:', fs.existsSync('.env'));
console.log('MONGO_URI:', process.env.MONGO_URI); // Debug line

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());

// Session middleware for Passport
app.use(session({
  secret: process.env.JWT_SECRET || 'fallback-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Placeholder for auth routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/developer', require('./routes/developer'));
app.use('/api/predict', require('./routes/predict'));

app.get('/', (req, res) => {
  res.send('Seedora Backend Running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
