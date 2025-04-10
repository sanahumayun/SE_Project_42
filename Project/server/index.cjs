const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Dummy middleware to attach user to req (FOR TESTING PURPOSES ONLY)
app.use((req, res, next) => {
  req.user = {
    _id: "606c5f4b5f1b2b001f0c0f0a", // replace with a valid ID from MongoDB
    role: "student", // change this to 'admin', 'tutor', or 'student' to test roles
  };
  next();
});

// Routes
const courseRoutes = require("./routes/courseRoutes.js");
const assignmentRoutes = require("./routes/assignmentRoutes.js");
const submissionRoutes = require("./routes/submissionRoutes.js");
const progressRoutes = require("./routes/progressRoutes.js");
const reviewRoutes = require("./routes/reviewRoutes.js");
const chatRoutes = require("./routes/chatRoutes.js");

app.use("/api/courses", courseRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => {
  res.send("Chat Server is running");
});

// Define the port; default to 8000 if PORT isn't set in the environment
const PORT = process.env.PORT || 8000;

// Connect to MongoDB and then start the server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    // Create HTTP server and attach socket.io
    const server = http.createServer(app);

    const io = socketIo(server, {
      cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    // Setup socket events (adjust accordingly in your socket file)
    require("./socket/socket")(io);

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));
