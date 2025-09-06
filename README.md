# Contacts API with Authentication

A Node.js REST API for managing contacts with user authentication and authorization.

## Features

- User registration and authentication
- JWT-based access and refresh tokens
- Contact CRUD operations
- User-specific contact filtering
- Session management
- Password hashing with bcrypt

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout user

### Contacts
- `GET /contacts` - Get all contacts (authenticated)
- `GET /contacts/:id` - Get contact by ID (authenticated)
- `POST /contacts` - Create new contact (authenticated)
- `PATCH /contacts/:id` - Update contact (authenticated)
- `DELETE /contacts/:id` - Delete contact (authenticated)

## Environment Variables

```env
MONGODB_CONNECTION_STRING=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
NODE_ENV=production
PORT=3000
```

## Deployment

This project is configured for deployment on Render.com. Make sure to set the required environment variables in your Render dashboard.
