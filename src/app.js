const express = require('express');
const app = express();
const multer = require('multer');
const morgan = require('morgan');
const fsPromises = require('fs/promises');
const { basename } = require('path');
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
const catchAsync = require(`${__dirname}/utils/catchAsync`);
const wkOpts = require(`${__dirname}/utils/wkOptions`);
const { wk } = require(`${__dirname}/utils/wkConverter`);
const { unzip } = require(`${__dirname}/utils/unzip`);
const { loggerAppStream, loggerApp } = require(`${__dirname}/utils/logger`);
const globalErrorHandler = require(`${__dirname}/controllers/errorController`);

app.use(morgan('combined', { stream: loggerAppStream }));

app.use(express.static(`${__dirname}/public/`));

//MAIN TEST PAGE
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
    //Request init time;
    const reqDate = `[${new Date().toISOString()}][${req.ip}]`;

    loggerApp.info(
      `[${reqDate} ${req.file.size / (1024 * 1024)} MB zip file size`,
    );
    const query = wkOpts.filterWkOpts(req.query);
    const paths = {
      unzipped: `${__dirname}/../unzipped/`,
      uploaded: `${__dirname}/../${req.file.path}`,
    };
    const unzipInfo = await unzip(paths.uploaded, paths.unzipped, reqDate);
    // TODO: Good Error Handling for this stream
    wk(unzipInfo, query, basename(unzipInfo.path), reqDate)
      .on('finish', (err) => {
        res.status(201).json(
          Object.assign({
            status: 'success',
            link: `${req.headers.host}/${basename(unzipInfo.path)}`,
          }),
        );
      })
      .on('close', () => {
        fsPromises.rm(`${paths.unzipped}${basename(unzipInfo.path)}`, {
          recursive: true,
          force: true,
        });
        fsPromises.rm(paths.uploaded, { recursive: true, force: true });
      });

    setTimeout(() => {
      //Remove pdf file after one hour
      fsPromises.rm(unzipInfo.path, { recursive: true, force: true });
    }, 3600000);
  }),
);

app.get('/:pdf', (req, res, next) => {
  res.download(`${__dirname}/../pdfFiles/${req.params.pdf}.pdf`);
  res.on('error', (err) => next(err));
});

app.use(globalErrorHandler);

module.exports = app;
