const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const { authenticate, checkRole } = require('./middleware/authMiddleware');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection + server startup
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("✅ MongoDB connected");

    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/users', require('./routes/userRoutes'));
    app.use('/api/courses', require('./routes/courseRoutes.js'));
    app.use('/api/assignments', require('./routes/assignmentRoutes.js'));
    app.use('/api/submission', require('./routes/submissionRoutes.js')); 
    console.log("submission routes loaded");
    app.use('/api/progress', authenticate, checkRole('admin', 'tutor', 'student'), require('./routes/progressRoutes.js'));
    app.use('/api/reviews', require('./routes/reviewRoutes.js'));
    app.use('/api/chat', require('./routes/chatRoutes.js'));

    // Socket.io
    const server = http.createServer(app);
    const io = socketIo(server, {
      cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });
    require("./socket/socket.js")(io);

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => console.error("❌ MongoDB connection error:", err));
