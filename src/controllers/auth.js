const { registerUser, loginUser, refreshUserSession, logoutUser, sendResetEmailService, resetPasswordService } = require('../services/auth');
const createHttpError = require('http-errors');

async function registerController(req, res) {
  const { name, email, password } = req.body;
  const result = await registerUser({ name, email, password });
  res.status(result.status).json(result);
}

async function loginController(req, res) {
  const { email, password } = req.body;
  const result = await loginUser({ email, password });
  res.cookie('refreshToken', result.data.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
  res.status(result.status).json(result);
}

async function refreshController(req, res) {
  let refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!refreshToken) {
    throw createHttpError(401, 'Refresh token not provided');
  }

  const result = await refreshUserSession(refreshToken);
  res.cookie('refreshToken', result.data.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
  res.status(result.status).json(result);
}

async function logoutController(req, res) {
  // Get session from authenticated user
  const userId = req.user._id;
  const session = await require('../db/Session').findOne({ userId });

  if (session) {
    const result = await logoutUser(session._id);
    res.clearCookie('refreshToken');
    res.status(result.status).send();
  } else {
    res.status(204).send();
  }
}

async function sendResetEmailController(req, res) {
  const { email } = req.body;
  const result = await sendResetEmailService(email);
  res.status(result.status).json(result);
}

async function resetPasswordController(req, res) {
  const { token, password } = req.body;
  const result = await resetPasswordService(token, password);
  res.status(result.status).json(result);
}

module.exports = { registerController, loginController, refreshController, logoutController, sendResetEmailController, resetPasswordController };