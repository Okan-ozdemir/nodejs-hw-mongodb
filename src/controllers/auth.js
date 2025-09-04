const { registerUser, loginUser, refreshUserSession, logoutUser } = require('../services/auth');
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
  const { refreshToken } = req.cookies;
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
  const { sessionId } = req.body; // Assuming sessionId is sent in body or from middleware
  const result = await logoutUser(sessionId);
  res.clearCookie('refreshToken');
  res.status(result.status).send();
}

module.exports = { registerController, loginController, refreshController, logoutController };