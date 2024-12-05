const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const rateLimiter = require('./middleware/rateLimiter');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const taskSocket = require('./sockets/taskSocket');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(rateLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

connectDB().then(() => {
    const server = app.listen(process.env.PORT || 8000, () => {
        console.log(`Server running on port ${process.env.PORT || 8000}`);
    });

    taskSocket(server);
}).catch(err => {
    console.error('Failed to connect to the database:', err);
});
