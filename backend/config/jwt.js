const jwt = require('jsonwebtoken');
//const { JWT_SECRET } = process.env;

  
function generateToken(user) {
    console.log("jwt", process.env.JWT_SECRET)
    const payload = { userId: user._id, roles: user.roles };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
}

function verifyToken(token) {
    return jwt.verify(token,  process.env.JWT_SECRET);
}

module.exports = { generateToken, verifyToken };
