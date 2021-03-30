const validator = require('validator');

const validError = Symbol('validError');
const pageSizesArray = [
  'a0',
  'a1',
  'a2',
  'a3',
  'a4',
  'a5',
  'a6',
  'a7',
  'a8',
  'a9',
  'b1',
  'b2',
  'b3',
  'b4',
  'b5',
  'b6',
  'b7',
  'b8',
  'b9',
  'b10',
  'c5e',
  'comm10e',
  'dle',
  'executive',
  'folio',
  'ledger',
  'legal',
  'letter',
  'tabloid',
  'custom',
];
//Object with validation
const validation = {
  validBoolean: (str) => (validator.isBoolean(str) ? Boolean(str) : validError),
  validNumber: (str) => ((+str).isNaN() ? validError : +str),
  validOrientation: (str) =>
    str.toLowerCase() === 'landscape' || str.toLowerCase() === 'portrait'
      ? str
      : validError,
  validUrl: (str) => (validator.isUrl(str) ? str : validError),
  validPageSize: (str) =>
    pageSizesArray.includes(str.toLowerCase()) ? str : validError,
};
//Available query options with validation functions
const options = {
  //Booleans
  noBackground: validation.validBoolean,
  footerLine: validation.validBoolean,
  headerLine: validation.validBoolean,
  printMediaType: validation.validBoolean,
  disableJavascript: validation.validBoolean,
  disableExternalLinks: validation.validBoolean,
  enableForms: validation.validBoolean,
  noImages: validation.validBoolean,
  lowquality: validation.validBoolean,
  defaultHeader: validation.validBoolean,
  //Numbers
  footerFontSize: validation.validNumber,
  pageHeight: validation.validNumber,
  pageWidth: validation.validNumber,
  marginBottom: validation.validNumber,
  marginTop: validation.validNumber,
  marginRight: validation.validNumber,
  marginLeft: validation.validNumber,
  footerSpacing: validation.validNumber,
  headerFontSize: validation.validNumber,
  headerSpacing: validation.validNumber,
  minimumFontSize: validation.validNumber,
  //Urls
  footerHtml: validation.validUrl,
  headerHtml: validation.validUrl,
  //Other
  pageSize: validation.validPageSize,
  orientation: validation.validOrientation,
  //<text>
  footerLeft: (str) => str,
  footerCenter: (str) => str,
  footerRight: (str) => str,
  headerCenter: (str) => str,
  headerLeft: (str) => str,
  headerRight: (str) => str,
};
exports.filterWkOpts = (raw, allowed = options) => {
  return Object.keys(raw)
    .filter((key) => Object.keys(allowed).includes(key))
    .reduce((obj, key) => {
      obj[key] = allowed[key](raw[key]);
      if (obj[key] === validError) {
        const err = new Error('Bad query value at ' + key);
        err.code = 'WK_ARGS_ERROR';
        throw err;
      }
      return obj;
    }, {});
};
