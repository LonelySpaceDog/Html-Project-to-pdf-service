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
  'loadErrorHandling',
  'loadMediaErrorHandling',
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

exports.filterWkOpts = (raw, allowed = options) => {
  return Object.keys(raw)
    .filter((key) => allowed.includes(key))
    .reduce((obj, key) => {
      obj[key] = raw[key];
      return obj;
    }, {});
};
