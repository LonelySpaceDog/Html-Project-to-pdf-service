const fsPromises = require('fs/promises');
const AppError = require(`${__dirname}/../utils/appError`);
const {
  loggerWk,
  loggerApp,
  loggerUnzip,
} = require(`${__dirname}/../utils/logger`);

const sendErrorDev = (err, res) => {
  if (err.name === 'unzip') {
    loggerUnzip.error(err);
  } else if (err.name === 'wkError') {
    loggerWk.error(err);
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

const sendErrorProd = (error, res, err) => {
  if (err.name === 'unzip') {
    loggerUnzip.error(err);
  } else if (err.name === 'wkError') {
    loggerWk.error(err);
  } else {
    loggerApp.error(err);
  }
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
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
const postNoFileErrorHandler = (error) => {
  const statusCode = error.statusCode || 401;
  const message = 'There is no file';
  return new AppError(message, statusCode);
};
const unzipBadErrorHandler = (error) => {
  const statusCode = 401;
  const message = 'something wrong with your archive';
  return new AppError(message, statusCode, 'unzip');
};
const wkArgsErrorHandling = (error) => {
  const statusCode = 401;
  return new AppError(error.message, statusCode, 'wkError');
};
const getNoFileErrorHandler = (error) => {
  const statusCode = error.statusCode;
  const message = 'There is no pdf with that name';
  return new AppError(error.message, statusCode, 'App');
};

module.exports = (err, req, res, _next) => {
  if (req.file) {
    fsPromises.rm(`${__dirname}/../../${req.file.path}`, { force: true });
  }
  //TODO: status code error for NODE_ENV=development
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV !== 'production') {
    return sendErrorDev(err, res);
  }
  let error = {
    Error: err,
    message: err.message,
    stack: err.stack,
    status: err.status,
    statusCode: err.statusCode,
    code: err.code,
  };
  console.log(JSON.stringify(error));
  if (error.code === 'ENOENT' && err.syscall !== 'stat') {
    error = openFileErrorHandler(error);
  }
  if (error.code === 'ENOENT' && err.syscall === 'stat') {
    error = getNoFileErrorHandler(error);
  }
  if (error.code === 'LIMIT_FILE_SIZE') {
    error = largeFileErrorHandler(error);
  }
  if (error.code === 'NO_FILE_WITH_REQUEST') {
    error = postNoFileErrorHandler(error);
  }
  if (
    err.message.startsWith('multi-disk zip files') ||
    err.message.endsWith('signature not found')
  ) {
    error = unzipBadErrorHandler(error);
  }
  if (error.code === 'WK_ARGS_ERROR') {
    error = wkArgsErrorHandling(error);
  }
  return sendErrorProd(error, res, err);
};
