const express = require('express');
const cors = require('cors');
const pino = require('pino-http')();
const contactsRouter = require('./routers/contacts');
const authRouter = require('./routers/auth');
const errorHandler = require('./middlewares/errorHandler');
const notFoundHandler = require('./middlewares/notFoundHandler');

function setupServer() {
  const app = express();

  app.use(cors());
  app.use(pino);
  app.use(express.json());

  // Add root route
  app.get('/', (req, res) => {
    res.json({
      message: 'Contacts API is running',
      endpoints: {
        auth: {
          register: 'POST /auth/register',
          login: 'POST /auth/login',
          refresh: 'POST /auth/refresh',
          logout: 'POST /auth/logout'
        },
        contacts: {
          getAllContacts: 'GET /contacts',
          getContact: 'GET /contacts/:contactId',
          createContact: 'POST /contacts',
          updateContact: 'PATCH /contacts/:contactId',
          deleteContact: 'DELETE /contacts/:contactId'
        }
      }
    });
  });

  app.use('/auth', authRouter);
  app.use('/contacts', contactsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = { setupServer };