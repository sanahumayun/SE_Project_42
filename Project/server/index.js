const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const { authenticate, checkRole } = require('./middleware/authMiddleware');
const http = require('http'); // Keep for local development
const socketIo = require('socket.io'); // Keep for local development

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', require('./routes/userRoutes'));
app.use("/api/courses", require("./routes/courseRoutes"));
app.use('/api/assignments', require("./routes/assignmentRoutes"));
app.use("/api/submission", require("./routes/submissionRoutes"));
app.use("/api/progress", authenticate, checkRole('admin', 'tutor', 'student'), require("./routes/progressRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/chat", require("./routes/chatRoutes")); 
app.use('/api/badges', authenticate, checkRole('student'), require("./routes/badgeRoutes"));

// Health check endpoint
app.get('/api/healthcheck', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Socket.io initialization (for local development only)
if (process.env.NODE_ENV !== 'production') {
  const server = http.createServer(app);
  const io = socketIo(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });
  require("./socket/socket")(io);
  
  server.listen(PORT, () => {
    console.log(`🚀 Local server running on port ${PORT}`);
  });
}

// Critical for Vercel deployment
module.exports = app;