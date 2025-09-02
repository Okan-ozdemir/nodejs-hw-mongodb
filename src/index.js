const { initMongoConnection } = require('./db/initMongoConnection');
const { setupServer } = require('./server');

async function main() {
  await initMongoConnection();
  setupServer();
}

main();