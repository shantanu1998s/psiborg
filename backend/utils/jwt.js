const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ userId }, 'secret', { expiresIn: '1h' });
};

module.exports = { generateToken };
