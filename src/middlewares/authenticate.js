const jwt = require('jsonwebtoken');
const Session = require('../db/Session');
const User = require('../db/User');
const createHttpError = require('http-errors');

const { JWT_SECRET } = process.env;

async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(createHttpError(401, 'Authorization header missing or invalid'));
  }

  const token = authHeader.substring(7); // Remove 'Bearer '

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    // Check if session exists and token is valid
    const session = await Session.findOne({
      userId: payload.userId,
      accessToken: token,
      accessTokenValidUntil: { $gt: new Date() }
    });

    if (!session) {
      return next(createHttpError(401, 'Access token expired'));
    }

    // Get user data
    const user = await User.findById(payload.userId);
    if (!user) {
      return next(createHttpError(401, 'User not found'));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(createHttpError(401, 'Access token expired'));
  }
}

module.exports = authenticate;