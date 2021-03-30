const dotenv = require('dotenv');
dotenv.config({ path: `${__dirname}/../config.env` });
const app = require(`${__dirname}/app`);
const { loggerApp } = require(`${__dirname}/utils/logger`);
const port = process.env.PORT;

app.listen(port, () => {
  loggerApp.info(`listening on port ${port}`);
});
