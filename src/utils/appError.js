class AppError extends Error {
  constructor(message, statusCode, name) {
    super(message);
    this.name = name || 'App';
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.time = new Date().toISOString();
    this.isOperational = true;
  }
}

module.exports = AppError;
