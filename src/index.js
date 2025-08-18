require('dotenv/config');
const initMongoConnection = require('./db/initMongoConnection');
require('./server');

const startApp = async () => {
  await initMongoConnection();
  // server.js zaten app.listen ile başlatıyor
};

startApp();