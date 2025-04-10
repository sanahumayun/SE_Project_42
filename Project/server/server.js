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


  // chat-app
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
  
  
dotenv.config();
  
  
const app = express();
app.use(cors());
app.use(express.json());
  
  
const server = http.createServer(app);
  
  
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});
  
  
require('./socket/socket')(io);
  

app.get('/', (req, res) => {
  res.send('Chat Server is running');
});
  
  
app.use('/api/chat', require('./routes/chatRoutes'));
  
  
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});