const mongoose = require('mongoose');
require('dotenv').config();

const initMongoConnection = async () => {
  try {
    const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } = process.env;
    const connectionString = `mongodb+srv://${MONGODB_USER}:${encodeURIComponent(MONGODB_PASSWORD)}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;
    
    await mongoose.connect(connectionString);
    
    console.log('MongoDB bağlantısı başarılı!');
  } catch (error) {
    console.error('MongoDB bağlantı hatası:', error.message);
    process.exit(1);
  }
};

module.exports = initMongoConnection;