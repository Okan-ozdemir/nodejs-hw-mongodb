const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const pino = require('pino-http')();
const contactsRouter = require('./routers/contacts');
const authRouter = require('./routers/auth');
const errorHandler = require('./middlewares/errorHandler');
const notFoundHandler = require('./middlewares/notFoundHandler');

function setupServer() {
  const app = express();

  app.use(cors());
  app.use(cookieParser());
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
          logout: 'POST /auth/logout',
          sendResetEmail: 'POST /auth/send-reset-email',
          resetPassword: 'POST /auth/reset-pwd'
        },
        contacts: {
          getAllContacts: 'GET /contacts',
          getContact: 'GET /contacts/:contactId',
          createContact: 'POST /contacts (supports photo upload)',
          updateContact: 'PATCH /contacts/:contactId (supports photo upload)',
          deleteContact: 'DELETE /contacts/:contactId'
        }
      }
    });
  });

  // Health check for Render
  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'OK',
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString()
    });
  });

  app.use('/auth', authRouter);
  app.use('/contacts', contactsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = { setupServer };