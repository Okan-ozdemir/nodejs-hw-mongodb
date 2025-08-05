require('dotenv').config();
const initMongoConnection = require('./db/initMongoConnection');
const setupServer = require('./server');

const startApp = async () => {
  await initMongoConnection(); // MongoDB bağlantısını kur
  setupServer();               // Sunucuyu başlat
};

startApp();
