const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const socketIo = require('socket.io');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Initialize express app
const app = express();

// Middleware
app.use(cors());
// app.use(cors({
//     origin: 'http://localhost:8000', // Allow requests from your frontend URL
//     methods: ['GET', 'POST','PATCH','PUT','DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization']
//   }));
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Start server
const server = app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});

// Set up socket.io for real-time updates
const io = socketIo(server);

// When a new task is created, notify connected users
io.on('connection', (socket) => {
    console.log('User connected');

    // Listen for task updates from the client
    socket.on('newTask', (task) => {
        console.log('New task created:', task);
        io.emit('taskCreated', task); // Broadcast to all clients
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});
