const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../db/User');
const Session = require('../db/Session');
const createHttpError = require('http-errors');

const { JWT_SECRET, JWT_REFRESH_SECRET } = process.env;

// Helper function to generate tokens
function generateTokens(userId) {
  const accessToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: '30d' });

  const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
  const refreshTokenValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  return { accessToken, refreshToken, accessTokenValidUntil, refreshTokenValidUntil };
}

async function registerUser({ name, email, password }) {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });

  return {
    status: 201,
    message: 'Successfully registered a user!',
    data: {
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  };
}

async function loginUser({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw createHttpError(401, 'Invalid credentials');
  }

  // Delete existing session if any
  await Session.deleteMany({ userId: user._id });

  const { accessToken, refreshToken, accessTokenValidUntil, refreshTokenValidUntil } = generateTokens(user._id);

  await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return {
    status: 200,
    message: 'Successfully logged in an user!',
    data: { accessToken, refreshToken },
  };
}

async function refreshUserSession(refreshToken) {
  try {
    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const session = await Session.findOne({ refreshToken, refreshTokenValidUntil: { $gt: new Date() } });

    if (!session) {
      throw createHttpError(401, 'Invalid refresh token');
    }

    // Delete old session
    await Session.deleteOne({ _id: session._id });

    const { accessToken, refreshToken: newRefreshToken, accessTokenValidUntil, refreshTokenValidUntil } = generateTokens(payload.userId);

    await Session.create({
      userId: payload.userId,
      accessToken,
      refreshToken: newRefreshToken,
      accessTokenValidUntil,
      refreshTokenValidUntil,
    });

    return {
      status: 200,
      message: 'Successfully refreshed a session!',
      data: { accessToken },
    };
  } catch (error) {
    throw createHttpError(401, 'Invalid refresh token');
  }
}

async function logoutUser(sessionId) {
  await Session.deleteOne({ _id: sessionId });
  return { status: 204 };
}

module.exports = { registerUser, loginUser, refreshUserSession, logoutUser };