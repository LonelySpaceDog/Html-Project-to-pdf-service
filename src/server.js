const app = require(`${__dirname}/app`);
const port = 5520;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
