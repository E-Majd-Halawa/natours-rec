const AppError = require('../utils/appError');
const handleValidatorErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data : ${errors.join('. ')}`;
  return new AppError(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  const message = `Duplicate field value: "${value}" for field "${field}". Please use another value`;
  return new AppError(message, 400);
};
const handleCastErrorDB = (err) => {
  const message = `invalid ${err.path}:${err.value}`;
  return new AppError(message, 400);
};
const sendErrorDev = (err, req, res) => {
  //API
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
    //RENDERED WEBSITE
  } else {
    res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: err.message,
    });
  }
};
const sendErrorProd = (err, req, res) => {
  //A)API
  if (req.originalUrl.startsWith('/api')) {
    //operational ,trusted error :send message to client
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
      //programing or other unknown error :don't leak error details
    } else {
      // 1)log error
      // console.error('Error !', err);
      // 2)send generic message
      res.status(500).json({
        status: 'error',
        message: 'something went very wrong',
      });
    }
  } else {
    //B)RENDERED WEBSITE
    if (err.isOperational) {
      res.status(err.statusCode).render('error', {
        title: 'Something went wrong',
        msg: err.message,
      });
      //programing or other unknown error :don't leak error details
    } else {
      // 1)log error
      console.error('Error !', err);
      // 2)send generic message
      res.status(err.statusCode).render('error', {
        title: 'Something went wrong',
        msg: 'Please try again later!',
      });
    }
  }
  console.log('ERROR 💥', err);
};
const handleJWTErorr = (err) => {
  return new AppError('Invalid token , please log in again!', 401);
};
const handleJWTExpiredError = (err) => {
  return new AppError('Your token has expired! please log in again', 401);
};
module.exports = (err, req, res, next) => {
  //console.log(err.stack);// بتعطينا الخطأ ووين حصل

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    if (err.name === 'CastError') err = handleCastErrorDB(err);
    if (err.code === 11000) err = handleDuplicateFieldsDB(err);
    if (err.name === 'ValidationError') err = handleValidatorErrorDB(err);
    if (err.name === 'JsonWebTokenError') err = handleJWTErorr(err);
    if (err.name === 'TokenExpiredError') err = handleJWTExpiredError(err);
    console.log(err.message);

    sendErrorProd(err, req, res);
    // let error = { ...err };
    // error.message = err.message;
    // error.name = err.name;
    // // let error = Object.assign(err);
    // if (error.name === 'CastError') error = handleCastErrorDB(error);
    // if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    // if (error.name === 'ValidationError') error = handleValidatorErrorDB(error);
    // sendErrorProd(error, res);

    // let error = Object.assign(err);
  }
};


