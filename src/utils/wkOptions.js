const options = [
  'noBackground',
  'footerCenter',
  'footerFontName',
  'footerFontSize',
  'footerHtml',
  'footerLeft',
  'footerLine',
  'footerRight',
  'footerSpacing',
  'headerCenter',
  'headerFontName',
  'headerFontSize',
  'headerHtml',
  'headerLeft',
  'headerLine',
  'headerRight',
  'headerSpacing',
  'pageSize',
  'printMediaType',
  'disableJavascript',
  'enableForms',
  'disableExternalLinks',
  'noImages',
  'defaultHeader',
  'pageHeight',
  'pageWidth',
  'marginBottom',
  'marginTop',
  'marginRight',
  'marginLeft',
  'orientation',
  'lowquality',
  'minimumFontSize',
];
//TODO:Make Options type checker
exports.filterWkOpts = (raw, allowed = options) => {
  return Object.keys(raw)
    .filter((key) => allowed.includes(key))
    .reduce((obj, key) => {
      obj[key] = raw[key];
      if (obj[key] === 'true') {
        obj[key] = true;
      } else if (obj[key] === 'false') {
        obj[key] = false;
      }
      return obj;
    }, {});
};
