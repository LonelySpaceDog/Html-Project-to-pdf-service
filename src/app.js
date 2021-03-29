const express = require('express');
const app = express();
const multer = require('multer');
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 2000000000 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/zip') {
      cb(new Error('Your File must be zip format'), false);
    } else {
      cb(null, true);
    }
  },
});
const morgan = require('morgan');
const catchAsync = require(`${__dirname}/utils/catchAsync`);
const wkOpts = require(`${__dirname}/utils/wkOptions`);
const fsPromises = require('fs/promises');
const { basename } = require('path');
const { wk } = require(`${__dirname}/utils/wkConverter`);
const { unzip } = require(`${__dirname}/utils/unzip`);
const { loggerApp } = require(`${__dirname}/utils/logger`);
const globalErrorHandler = require(`${__dirname}/controllers/errorController`);

app.use(morgan('dev'));
app.use(express.static(`${__dirname}/public/`));

//TEST REASONS
app.get('/', (req, res, _next) => {
  res.status(200).write(`${__dirname}/public/index.html`);
  res.end();
});
//

app.post(
  '/upload',
  upload.single('html.zip'),
  catchAsync(async (req, res, next) => {
    //Unzipping
    if (!req.file) {
      const err = new Error('Please load your file');
      err.code = 'NO_FILE_WITH_REQUEST';
      return next(err);
    }
    const reqDate = `[${new Date().toISOString()}]`; //Request init time;

    loggerApp.info(
      `[${reqDate} ${req.file.size / (1024 * 1024)} MB zip file size`,
    );
    const query = wkOpts.filterWkOpts(req.query);
    const paths = {
      unzipped: `${__dirname}/../unzipped/`,
      uploaded: `${__dirname}/../${req.file.path}`,
    };
    const unzipInfo = await unzip(paths.uploaded, paths.unzipped, reqDate);
    //     loggerUnzip.info(`[${reqDate.toString}][UNZIPPING][ERROR] ${err}`);
    // TODO: Good Error Handling
    wk(unzipInfo, query, basename(unzipInfo.path), reqDate)
      .on('error', (err) => {
        err.code = 'WK_ERROR';
        next(err);
      })
      .on('end', () => {
        res.status(201).json({
          status: 'success',
          link: `${req.headers.host}/${basename(unzipInfo.path)}`,
        });
      })
      .on('close', () => {
        fsPromises.rm(`${paths.unzipped}${basename(unzipInfo.path)}`, {
          recursive: true,
          force: true,
        });
        fsPromises.unlink(paths.uploaded);
      });

    setTimeout(() => {
      fsPromises.unlink(unzipInfo.path);
    }, 3600000);
  }),
);

app.get('/:pdf', (req, res, next) => {
  res.download(`${__dirname}/../pdfFiles/${req.params.pdf}.pdf`);
  res.on('error', (err) => next(err));
});

app.use(globalErrorHandler);

module.exports = app;
