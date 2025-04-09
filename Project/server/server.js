const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Dummy middleware to attach user to req (FOR TESTING PURPOSES ONLY)
app.use((req, res, next) => {
  req.user = {
    _id: '606c5f4b5f1b2b001f0c0f0a', // ✅ replace with a valid ID from MongoDB
    role: 'student' // ✅ change this to 'admin', 'tutor', or 'student' to test roles
  };
  next();
});

// Routes
const courseRoutes = require('./routes/courseRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const submissionRoutes = require('./routes/submissionRoutes'); 
const progressRoutes = require('./routes/progressRoutes');    
const reviewRoutes = require('./routes/reviewRoutes');         

app.use('/api/courses', courseRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/submissions', submissionRoutes);  
app.use('/api/progress', progressRoutes);       
app.use('/api/reviews', reviewRoutes);        

// DB & Server Init
mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(5000, () => console.log('Server running on port 5000')))
  .catch((err) => console.error('MongoDB connection error:', err));
