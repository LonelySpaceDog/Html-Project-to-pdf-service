const dotenv = require('dotenv');
dotenv.config({ path: `${__dirname}/../config.env` });
const app = require(`${__dirname}/app`);
const { loggerApp } = require(`${__dirname}/utils/logger`);
const port = process.env.PORT;
const { mkdir } = require('fs');

mkdir(`${__dirname}/../pdfFiles/`, { recursive: true }, (err) => {
  if (err) {
    loggerApp.error(err);
    throw err;
  }
});

mkdir(`${__dirname}/../unzipped/`, { recursive: true }, (err) => {
  if (err) {
    loggerApp.error(err);
    throw err;
  }
});

app.listen(port, () => {
  loggerApp.info(`listening on port ${port}`);
});
