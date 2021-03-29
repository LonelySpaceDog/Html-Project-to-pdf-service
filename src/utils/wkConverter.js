const wkhtmltopdf = require('wkhtmltopdf');
const { loggerWk } = require(`${__dirname}/logger`);
const { createWriteStream } = require('fs');
const { stat } = require('fs/promises');

exports.wk = (html, options, pdfName, reqDate) => {
  let startHtmlToPdf; //Variable for logging time
  const pdfPath = `${__dirname}/../../pdfFiles/${pdfName}.pdf`;
  loggerWk.info(`[${reqDate}]` + JSON.stringify(options));
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
  //Event 'pipe' to log time of pdf creation
  createPdf.on('pipe', () => {
    startHtmlToPdf = new Date();
  });
  pdfStream.pipe(createPdf).on('finish', async () => {
    //Loging Format time and pdf size
    const pdfStats = await stat(pdfPath);
    loggerWk.info(`[${reqDate}] Formated in ${new Date() - startHtmlToPdf}\
 ms.Pdf size ${pdfStats.size / (1024 * 1024)} MiB`);
  });
  pdfStream.on('error', (err) => {
    createPdf.destroy(err);
  });
  return createPdf;
};
