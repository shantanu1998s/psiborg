const { verifyToken } = require('../config/jwt');

function authenticate(req, res, next) {
    // Extract token from the 'Authorization' header
    const token = req.header('Authorization')?.split(' ')[1]; // Get token after 'Bearer'
    console.log("token",token)
    if (!token) {
        return res.status(401).json({ message: 'Access denied, no token provided' });
    }

    try {
        // Verify the token using your verifyToken function
        const decoded = verifyToken(token);
        req.user = decoded;  // Add decoded user to the request object
        next();  // Pass control to the next middleware/handler
    } catch (err) {
        return res.status(400).json({ message: 'Invalid token' });
    }
}

module.exports = authenticate;
