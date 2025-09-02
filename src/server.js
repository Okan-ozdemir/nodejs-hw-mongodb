const express = require('express');
const cors = require('cors');
const pino = require('pino-http')();
const { getContactsController, getContactController } = require('./controllers/contacts');

function setupServer() {
  const app = express();

  app.use(cors());
  app.use(pino);

  app.get('/contacts', getContactsController);
  app.get('/contacts/:contactId', getContactController);

  // 404 handler for non-existing routes
  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = { setupServer };