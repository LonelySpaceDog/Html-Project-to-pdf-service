const wkhtmltopdf = require('wkhtmltopdf');
const { loggerWk } = require(`${__dirname}/logger`);
const { createWriteStream } = require('fs');
const { stat } = require('fs/promises');
const winston = require('winston');

exports.wk = (html, options, pdfName, reqDate, next) => {
  let startHtmlToPdf; //Variable for logging time
  const pdfPath = `${__dirname}/../../pdfFiles/${pdfName}.pdf`;
  const pdfStream = wkhtmltopdf(
    html.data.replace(
      /((href|src)=")\/?(?!http)(?!#)([^"]+)/g,
      '$1' + html.path + '/' + '$3',
    ),
    Object.assign(
      {
        resolveRelativeLinks: false,
        enableLocalFileAccess: true,
        loadErrorHandling: 'ignore',
        loadMediaErrorHandling: 'ignore',
        logLevel: 'warn',
        debug: true,
      },
      options,
    ),
    reqDate,
  );
  const createPdf = createWriteStream(pdfPath);
  //Event 'pipe' for log time of pdf creation
  createPdf.on('pipe', () => {
    startHtmlToPdf = new Date();
  });
  // pdfStream.on('error', (err) => next(err));
  pdfStream.pipe(createPdf).on('finish', async () => {
    //Loging Format time
    const pdfStats = await stat(pdfPath);
    loggerWk.info(`Formated in ${new Date() - startHtmlToPdf}\
 ms with size ${pdfStats.size / (1024 * 1024)} MiB`);
  });
  return pdfStream;
};
