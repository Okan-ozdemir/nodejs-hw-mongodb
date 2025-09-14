const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const pino = require('pino-http')();
const swaggerUi = require('swagger-ui-express');
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

  // Swagger documentation
  const swaggerDocument = {
    openapi: '3.1.0',
    info: {
      version: '1.0.0',
      title: 'Node.js Contacts API',
      description: 'A REST API for managing contacts with authentication, email notifications, and image uploads.'
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      },
      {
        url: 'https://nodejs-hw-mongodb-hw6-tgzj.onrender.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    paths: {
      '/contacts': {
        get: {
          tags: ['Contacts'],
          summary: 'Get all contacts',
          operationId: 'getAllContacts',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'Contacts retrieved successfully'
            }
          }
        },
        post: {
          tags: ['Contacts'],
          summary: 'Create a new contact',
          operationId: 'createContact',
          security: [{ bearerAuth: [] }],
          responses: {
            '201': {
              description: 'Contact created successfully'
            }
          }
        }
      },
      '/contacts/{id}': {
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Contact ID',
            schema: { type: 'string' }
          }
        ],
        get: {
          tags: ['Contacts'],
          summary: 'Get a specific contact',
          operationId: 'getContactById',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'Contact found successfully'
            },
            '404': {
              description: 'Contact not found'
            }
          }
        },
        patch: {
          tags: ['Contacts'],
          summary: 'Update a contact',
          operationId: 'updateContact',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'Contact updated successfully'
            },
            '404': {
              description: 'Contact not found'
            }
          }
        },
        delete: {
          tags: ['Contacts'],
          summary: 'Delete a contact',
          operationId: 'deleteContact',
          security: [{ bearerAuth: [] }],
          responses: {
            '204': {
              description: 'Contact deleted successfully'
            },
            '404': {
              description: 'Contact not found'
            }
          }
        }
      }
    }
  };

  // Swagger UI route
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // Add root route
  app.get('/', (req, res) => {
    res.json({
      message: 'Contacts API is running',
      documentation: {
        swaggerUI: 'GET /api-docs',
        redoc: 'GET /docs/index.html'
      },
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