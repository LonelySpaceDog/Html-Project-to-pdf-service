const app = require(`${__dirname}/app`);
const { loggerApp } = require(`${__dirname}/utils/logger`);
const port = 5520;

app.listen(port, () => {
  loggerApp.info(`listening on port ${port}`);
});
