const request = require('supertest');
const express = require('express');
const cors = require('cors');
const contactsRouter = require('../routers/contacts');
const authRouter = require('../routers/auth');
const errorHandler = require('../middlewares/errorHandler');
const notFoundHandler = require('../middlewares/notFoundHandler');

let app;

beforeAll(() => {
  // Create test app
  app = express();
  app.use(cors());
  app.use(express.json());

  // Routes
  app.use('/auth', authRouter);
  app.use('/contacts', contactsRouter);

  // Error handlers
  app.use(notFoundHandler);
  app.use(errorHandler);
});

describe('Contacts API', () => {
  let authToken = '';

  beforeAll(async () => {
    // Register and login to get token
    await request(app)
      .post('/auth/register')
      .send({
        name: 'Test User',
        email: 'contact-test@example.com',
        password: 'password123'
      });

    const loginResponse = await request(app)
      .post('/auth/login')
      .send({
        email: 'contact-test@example.com',
        password: 'password123'
      });

    authToken = loginResponse.body.data.accessToken;
  });

  test('GET /contacts - should return contacts (authenticated)', async () => {
    const response = await request(app)
      .get('/contacts')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Successfully found contacts!');
    expect(response.body.data).toHaveProperty('data');
  });

  test('POST /contacts - should create contact', async () => {
    const contactData = {
      name: 'John Doe',
      phoneNumber: '+1234567890',
      email: 'john@example.com',
      contactType: 'personal'
    };

    const response = await request(app)
      .post('/contacts')
      .set('Authorization', `Bearer ${authToken}`)
      .send(contactData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Successfully created a contact!');
    expect(response.body.data).toHaveProperty('name');
    expect(response.body.data.name).toBe('John Doe');
  });

  test('GET /contacts - should return 401 without auth', async () => {
    const response = await request(app)
      .get('/contacts');

    expect(response.status).toBe(401);
  });
});