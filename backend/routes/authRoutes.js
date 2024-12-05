const express = require('express');
const { register, login, updateProfile, logout } = require('../controllers/authController');
const authenticate = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.patch('/profile', authenticate, updateProfile);


module.exports = router;
