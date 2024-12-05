const bcrypt = require('bcryptjs');
const User = require('../models/User.js');
const { generateToken } = require('../config/jwt');
const { sendEmail } = require('../services/emailService');

// Register new user
async function register(req, res) {
    const { username, email, password, role, manager } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword, role, manager });

    await user.save();

    // Send confirmation email
    await sendEmail(email, 'Welcome to TaskManager', 'Thank you for signing up!');
    
    res.status(201).json({ message: 'User registered successfully' });
}

// User login functionality
async function login(req, res) {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = generateToken(user);

        // Return user details and the token
        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                manager: user.manager,
            },
            token
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

// Update user profile
const updateProfile = async (req, res) => {
    const { username, email, role, password, manager } = req.body;
    const userId = req.user.userId;

    const updateFields = {};

    if (username) updateFields.username = username;
    if (email) updateFields.email = email;
    if (role) updateFields.role = role;
    if (manager) updateFields.manager = manager;
    if (password) updateFields.password = bcrypt.hashSync(password, 10);

    try {
        const user = await User.findByIdAndUpdate(userId, updateFields, { new: true });

        const token = generateToken(user);

        res.status(200).json({
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                manager: user.manager,
            },
            token, // Send the new token
        });
    } catch (err) {
        res.status(400).json({ message: 'Error updating profile', error: err });
    }
};

// Logout user functionality
const logout = (req, res) => {
   
    res.status(200).json({ message: 'Logout successful. Please discard the JWT token on the client side.' });
};

module.exports = { register, login, updateProfile, logout };
