const mongoose = require('mongoose');
require('dotenv').config();

async function initMongoConnection() {
  const connectionString = process.env.MONGODB_CONNECTION_STRING || `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}/${process.env.MONGODB_DB}?retryWrites=true&w=majority`;

  try {
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.error('Mongo connection failed:', error);
    process.exit(1);
  }
}

module.exports = { initMongoConnection };