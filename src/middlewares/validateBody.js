const createHttpError = require('http-errors');

function validateBody(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      throw createHttpError(400, error.details[0].message);
    }
    next();
  };
}

module.exports = validateBody;