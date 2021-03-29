const AppError = require(`${__dirname}/../utils/appError`);
const { loggerApp, loggerUnzip } = require(`${__dirname}/../utils/logger`);

const sendErrorDev = (err, res) => {
  if (err.name === 'Unzip') {
    loggerUnzip.error(err);
  } else {
    loggerApp.error(err);
  }
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.name === 'App') {
    loggerApp.error(err);
  } else if (err.name === 'Unzip') {
    loggerUnzip.error(err);
  } //Logging full error to console
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: 'something went very wrong!',
    });
  }
};

const openFileErrorHandler = (error) => {
  const message = 'Your index.html must be in root folder of archive';
  const statusCode = 401;
  return new AppError(message, statusCode);
};
const largeFileErrorHandler = (error) => {
  const statusCode = 401;
  return new AppError(error.message, statusCode);
};
const noFileErrorHandler = (error) => {
  const statusCode = 401;
  const message = 'Please Load Your File';
  return new AppError(message, statusCode);
};
const unzipBadErrorHandler = (error) => {
  const statusCode = 401;
  const message = 'something wrong with your archive';
  const name = 'Unzip';
  return new AppError(message, statusCode, name);
};

module.exports = (err, req, res, _next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV !== 'production') {
    return sendErrorDev(err, res);
  }
  let error = { ...err };
  console.log(JSON.stringify(error));
  if (error.code === 'ENOENT') {
    error = openFileErrorHandler(error);
  }
  if (error.code === 'LIMIT_FILE_SIZE') {
    error = largeFileErrorHandler(error);
  }
  if (error.code === 'NO_FILE_WITH_REQUEST') {
    error = noFileErrorHandler(error);
  }
  if (
    err.message.startsWith('multi-disk zip files') ||
    err.message.endsWith('signature not found')
  ) {
    error = unzipBadErrorHandler(error);
  }
  return sendErrorProd(error, res);
};
