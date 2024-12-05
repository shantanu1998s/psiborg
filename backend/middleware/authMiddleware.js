const { verifyToken } = require('../config/jwt');

function authenticate(req, res, next) {
   
    const token = req.header('Authorization')?.split(' ')[1]; 
    console.log("token",token)
    if (!token) {
        return res.status(401).json({ message: 'Access denied, no token provided' });
    }

    try {
        
        const decoded = verifyToken(token);
        req.user = decoded; 
        next();  
    } catch (err) {
        return res.status(400).json({ message: 'Invalid token' });
    }
}

module.exports = authenticate;
