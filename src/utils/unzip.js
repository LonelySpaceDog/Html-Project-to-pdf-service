const anzip = require('anzip');
const fsPromises = require('fs/promises');
const { loggerUnzip } = require(`${__dirname}/logger`);

exports.unzip = async (zipPath, unzipPath, reqDate) => {
  const createdPath = await fsPromises.mkdtemp(unzipPath);
  loggerUnzip.info(`${reqDate} Path ${createdPath} created`);
  const unzipInfo = await anzip(zipPath, {
    outputPath: createdPath,
    outputContent: false,
    disableSave: false,
  });
  //loggerUnzip.info(JSON.stringify(unzipInfo.files));
  loggerUnzip.info(
    `[${reqDate}][UNZIPPING] Unzipped in ${unzipInfo.duration * 1000} ms`,
  );
  const fileList = unzipInfo.files.map((el) => el.name);
  loggerUnzip.info(
    `[${reqDate}][UNZIPPING] Files in archive:  ${fileList.join(', ')}`,
  );
  unzipInfo.data = await fsPromises.readFile(
    `${createdPath}/index.html`,
    'utf8',
  );
  unzipInfo.path = createdPath;
  return unzipInfo;
};
