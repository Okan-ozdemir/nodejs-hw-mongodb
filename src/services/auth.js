const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../db/User');
const Session = require('../db/Session');
const createHttpError = require('http-errors');

const { JWT_SECRET, JWT_REFRESH_SECRET, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM, APP_DOMAIN } = process.env;

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
      data: { accessToken, refreshToken: newRefreshToken },
    };
  } catch (error) {
    throw createHttpError(401, 'Invalid refresh token');
  }
}

async function logoutUser(sessionId) {
  await Session.deleteOne({ _id: sessionId });
  return { status: 204 };
}

async function sendResetEmailService(email) {
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const resetToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: '5m' });
  const resetLink = `${APP_DOMAIN}/reset-password?token=${resetToken}`;

  const transporter = nodemailer.createTransporter({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: false,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: SMTP_FROM,
    to: email,
    subject: 'Password Reset Request',
    html: `<p>You requested a password reset. Click the link below to reset your password:</p><p><a href="${resetLink}">Reset Password</a></p><p>This link will expire in 5 minutes.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return {
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    };
  } catch (error) {
    throw createHttpError(500, 'Failed to send the email, please try again later.');
  }
}

async function resetPasswordService(token, password) {
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const { email } = payload;

    const user = await User.findOne({ email });
    if (!user) {
      throw createHttpError(404, 'User not found!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.updateOne({ email }, { password: hashedPassword });

    // Delete all sessions for this user
    await Session.deleteMany({ userId: user._id });

    return {
      status: 200,
      message: 'Password has been successfully reset.',
      data: {},
    };
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      throw createHttpError(401, 'Token is expired or invalid.');
    }
    throw error;
  }
}

module.exports = { registerUser, loginUser, refreshUserSession, logoutUser, sendResetEmailService, resetPasswordService };