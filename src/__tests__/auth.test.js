const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const contactsRouter = require('../routers/contacts');
const authRouter = require('../routers/auth');
const errorHandler = require('../middlewares/errorHandler');
const notFoundHandler = require('../middlewares/notFoundHandler');

let app;

beforeAll(async () => {
  // Create test app
  app = express();
  app.use(cors());
  app.use(express.json());

  // Root route
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

  // Routes
  app.use('/auth', authRouter);
  app.use('/contacts', contactsRouter);

  // Error handlers
  app.use(notFoundHandler);
  app.use(errorHandler);
});

afterAll(async () => {
  // Clean up will be handled by Jest
});

describe('Auth API', () => {
  test('GET / - should return API info', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Contacts API is running');
  });

  test('POST /auth/register - should register user', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };

    const response = await request(app)
      .post('/auth/register')
      .send(userData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Successfully registered a user!');
    expect(response.body.data).toHaveProperty('name');
    expect(response.body.data).toHaveProperty('email');
    expect(response.body.data).not.toHaveProperty('password');
  });

  test('POST /auth/login - should login user', async () => {
    const loginData = {
      email: 'test@example.com',
      password: 'password123'
    };

    const response = await request(app)
      .post('/auth/login')
      .send(loginData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Successfully logged in an user!');
    expect(response.body.data).toHaveProperty('accessToken');
  });

  test('POST /auth/register - should reject duplicate email', async () => {
    const userData = {
      name: 'Another User',
      email: 'test@example.com', // Same email
      password: 'password456'
    };

    const response = await request(app)
      .post('/auth/register')
      .send(userData);

    expect(response.status).toBe(409);
  });
});