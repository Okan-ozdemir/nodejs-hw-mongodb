const errorHandler = (err, req, res, next) => {
  const response = {
    status: err.status || 500,
    message: err.message || 'Something went wrong',
    data: err.data
  };
  
  // Geliştirme ortamında stack trace ekle
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }
  
  res.status(response.status).json(response);
};

module.exports = errorHandler;