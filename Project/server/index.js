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
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Auth Routes
app.use('/api/auth', authRoutes);

// Routes
const courseRoutes = require("./routes/courseRoutes.js");
const assignmentRoutes = require("./routes/assignmentRoutes.js");
const submissionRoutes = require("./routes/submissionRoutes.js");
const progressRoutes = require("./routes/progressRoutes.js");
const reviewRoutes = require("./routes/reviewRoutes.js");
const chatRoutes = require("./routes/chatRoutes.js");
const userRoutes = require('./routes/userRoutes');

const badgeRoutes = require("./routes/badgeRoutes.js");

const gradeRoutes = require('./routes/gradeRoutes');

const bodyParser = require("body-parser");

app.use('/api/users', userRoutes);
app.use("/api/courses", courseRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/progress", authenticate, checkRole('admin', 'tutor', 'student'), progressRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/chat", chatRoutes); 

app.use('/api/badges', authenticate, checkRole('student'), badgeRoutes);

app.use('/api/grades', gradeRoutes);


const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
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
