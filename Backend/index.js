const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const fs = require('fs');
console.log('ENV FILE EXISTS:', fs.existsSync('.env'));
console.log('MONGO_URI:', process.env.MONGO_URI); // Debug line

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
}))
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Placeholder for auth routes
app.use('/api/auth', require('./routes/auth'));

app.get('/', (req, res) => {
  res.send('Seedora Backend Running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
