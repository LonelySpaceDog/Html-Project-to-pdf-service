const express = require('express');
const app = express();
const multer = require('multer');
const upload = multer({ dest: 'uploads/', limits: { fileSize: 2000000000 } });
const fsPromises = require('fs/promises');
const { createWriteStream, createReadStream } = require('fs');
const wkhtmltopdf = require('wkhtmltopdf');
const morgan = require('morgan');
const catchAsync = require(`${__dirname}/utils/catchAsync`);
const anzip = require('anzip');
const wkOpts = require(`${__dirname}/utils/wkOptions`);

app.use(morgan('dev'));

app.use(express.static(`${__dirname}/public/`));

app.get('/', (req, res, _next) => {
  res.status(200).write(`${__dirname}/public/index.html`);
  res.end();
});

app.post(
  '/upload',
  upload.single('html.zip'),
  catchAsync(async (req, res, next) => {
    console.log(req.query);
    const query = req.query;
    wkOpts.forEach((el) => delete query[el]);
    const paths = {
      unzipped: `${__dirname}/../unzipped/${req.file.filename}/`,
      uploaded: `${__dirname}/../${req.file.path}`,
      pdf: `${__dirname}/../pdfFiles/${req.file.filename}.pdf`,
    };
    await fsPromises.mkdir(paths.unzipped);
    const unzipInfo = await anzip(`${paths.uploaded}`, {
      outputPath: paths.unzipped,
      outputContent: false,
      disableSave: false,
    });
    console.log(`Unzipped in ${unzipInfo.duration * 1000} ms`);
    const fileList = unzipInfo.files.map((el) => el.name);
    console.log('Files in archive: ' + fileList);

    unzipInfo.data = await fsPromises.readFile(
      `${paths.unzipped}index.html`,
      'utf8',
    );

    //Variable for log time
    let startHtmlToPdf;
    const pdfStream = wkhtmltopdf(
      unzipInfo.data.replace(
        /((href|src)=")\/?(?!http)(?!#)([^"]+)/g,
        '$1' + paths.unzipped + '$3',
      ),
      Object.assign(
        {
          resolveRelativeLinks: false,
          enableLocalFileAccess: true,
        },
        req.query,
      ),
      (err) => {
        if (err) {
          res.status(400).json({
            status: 'fail',
            error: err,
          });
          return next(err);
        }
      },
    );
    const createPdf = createWriteStream(paths.pdf);
    //Event 'pipe' for log time of pdf creation
    createPdf.on('pipe', () => {
      console.log('piped');
      startHtmlToPdf = new Date();
    });
    pdfStream.pipe(createPdf).on('finish', () => {
      //Loging Format time
      console.log(`Formated in ${new Date() - startHtmlToPdf} ms`);
      const readPdf = createReadStream(paths.pdf);
      readPdf.pipe(res);
      res.on('close', () => {
        fsPromises.unlink(paths.uploaded);
      });
    });
  }),
);

module.exports = app;
