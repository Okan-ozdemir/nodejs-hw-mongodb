const createHttpError = require('http-errors');
const mongoose = require('mongoose');

function isValidId(req, res, next) {
  const { contactId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    throw createHttpError(400, 'Invalid contact ID');
  }
  next();
}

module.exports = isValidId;