const redis = require('redis');
const client = redis.createClient();

client.on('error', (err) => {
  console.error('Redis connection error:', err);
});

const cacheMiddleware = (req, res, next) => {
  const key = req.originalUrl;
  client.get(key, (err, data) => {
    if (err) throw err;
    if (data) {
      res.json(JSON.parse(data));
    } else {
      next();
    }
  });
};

module.exports = { cacheMiddleware, client };
