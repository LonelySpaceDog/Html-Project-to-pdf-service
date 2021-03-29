//Logger for unzipping
const winston = require('winston');
//Logger for anzip
exports.loggerUnzip = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.json(),
    winston.format.colorize(),
    winston.format.prettyPrint(),
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
        winston.format.prettyPrint(),
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
    winston.format.prettyPrint(),
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

        winston.format.prettyPrint(),
      ),
    }),
  );
}
//Logger for App
exports.loggerApp = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.prettyPrint(),
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
exports.loggerApp;
if (process.env.NODE_ENV !== 'production') {
  exports.loggerApp.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.simple(),
        winston.format.colorize(),
        winston.format.prettyPrint(),
      ),
    }),
  );
}
