# Node.js MongoDB Homework

A RESTful API for managing contacts with MongoDB integration.

## Features

- Get all contacts
- Get contact by ID
- MongoDB integration with Mongoose
- Express.js server with CORS support
- Pino HTTP logging

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `env.example` to `.env` and configure your MongoDB credentials
4. Import contacts data:
   ```bash
   npm run import
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

- `GET /contacts` - Get all contacts
- `GET /contacts/:contactId` - Get contact by ID

## Environment Variables

- `PORT` - Server port (default: 3000)
- `MONGODB_USER` - MongoDB username
- `MONGODB_PASSWORD` - MongoDB password
- `MONGODB_URL` - MongoDB cluster URL
- `MONGODB_DB` - Database name

## Scripts

- `npm run dev` - Start development server with nodemon
- `npm run import` - Import contacts from JSON file
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically