const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');

dotenv.config();

const app = express();

// Middleware to parse incoming requests as JSON
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const { authenticate, checkRole } = require('./middleware/authMiddleware');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);



    
   

