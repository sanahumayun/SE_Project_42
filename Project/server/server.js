const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Dummy middleware to attach user to req (for testing)
app.use((req, res, next) => {
  // Simulate a logged-in user
  req.user = {
    _id: '606c5f4b5f1b2b001f0c0f0a',
    role: 'admin', // change to 'tutor' or 'student' to test
  };
  next();
});

// Routes
const courseRoutes = require('./routes/courseRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');

app.use('/api/courses', courseRoutes);
app.use('/api/assignments', assignmentRoutes);

// DB & Server Init
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(5000, () => console.log('Server running on port 5000')))
  .catch((err) => console.error('MongoDB connection error:', err));
