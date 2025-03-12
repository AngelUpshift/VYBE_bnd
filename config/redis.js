const redis = require("redis");

// Create a Redis client
const client = redis.createClient();

// Handle Redis connection errors
client.on("error", (err) => {
  console.error("Redis error:", err);
});

client.connect();

// Export the Redis client
module.exports = client;
