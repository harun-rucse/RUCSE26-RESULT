const AppError = require('./../utils/appError');

const handleCastErrorDB = err => {
  return new AppError('Invalid Id. Please use another id', 400);
};

const handleDuplicateFieldDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value.`;

  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data.${errors.join('. ')}`;

  return new AppError(message, 400);
};

const handleJsonWebTokenError = () => {
  return new AppError('Invalid token. Please login again!', 401);
};

const handleTokenExpiredError = () => {
  return new AppError('Your toke has expired. Please login again!', 401);
};

const sendErrorDev = (req, res, err) => {
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  } else {
    res.render('errorPage', {
      message: err.message,
      statusCode: err.statusCode
    });
  }
};

const sendErrorProd = (req, res, err) => {
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: 'Something went very wrong'
      });
    }
  } else {
    if (err.isOperational) {
      res.render('errorPage', {
        message: err.message,
        statusCode: err.statusCode
      });
    } else {
      res.render('errorPage', {
        message: 'Please try again!',
        statusCode: 500
      });
    }
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV == 'development') {
    sendErrorDev(req, res, err);
  } else if (process.env.NODE_ENV == 'production') {
    let error = { ...err };
    error.message = err.message;

    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldDB(error);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (err.name === 'JsonWebTokenError') error = handleJsonWebTokenError();
    if (err.name === 'TokenExpiredError') error = handleTokenExpiredError();

    sendErrorProd(req, res, error);
  }
};
