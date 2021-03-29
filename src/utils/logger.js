//Logger for unzipping
const winston = require('winston');
//Logger for anzip
exports.loggerUnzip = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.json(),
    winston.format.colorize(),
  ),
  defaultMeta: { service: 'Unzipping' },
  transports: [
    new winston.transports.File({
      filename: 'Errors.log',
      level: 'error',
    }),
    new winston.transports.File({ filename: 'debug.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  exports.loggerUnzip.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  );
}
//Logger for converting
exports.loggerWk = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.json(),
    winston.format.colorize(),
  ),
  defaultMeta: { service: 'WkHtmlToPdf' },
  transports: [
    new winston.transports.File({
      filename: 'Errors.log',
      level: 'error',
    }),
    new winston.transports.File({ filename: 'debug.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  exports.loggerWk.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  );
}
//Logger for App
exports.loggerApp = winston.createLogger({
  level: 'http',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.errors({ stack: true }),
    winston.format.json(),
    winston.format.colorize(),
  ),
  defaultMeta: { service: 'App' },
  transports: [
    new winston.transports.File({
      filename: 'Errors.log',
      level: 'error',
    }),
    new winston.transports.File({ filename: 'debug.log' }),
  ],
});
if (process.env.NODE_ENV !== 'production') {
  exports.loggerApp.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.simple(),
        winston.format.colorize(),
      ),
    }),
  );
}

exports.loggerAppStream = {
  write: (message) => exports.loggerApp.http(message),
};
