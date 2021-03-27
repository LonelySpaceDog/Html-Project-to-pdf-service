# Html-Project-to-pdf-service

# Awailable Options(query) for Request

  noBackground <boolean\> - Do not print background

  footerCenter/headerCenter <text\>  - Centered footer/header text

  footerFontName/headerFontName <name\> - Set footer/header font name (must have them on your machine)

  footerFontSize/headerFontSize <size\>- Set footer/header font size (default 12)

  footerHtml/headerHtml <url\> - Adds a html footer

  footerLeft/headerLeft <text\> - Left aligned footer/header text

  footerLine/headerLine <boolean\> - Display line above the footer/header 

  footerRight/headerRight <text\> - Right aligned footer/header text

  footerSpacing/headerSpacing <real\> - Spacing between footer/header and content in mm (default 0)

  printMediaType  <boolean\> - Use print media-type instead of screen 

  loadErrorHandling <handler\> - Specify how to handle pages that fail to
                                      load: abort, ignore or skip (default
                                      abort) 

  loadMediaErrorHandling <handler\> - Specify how to media files pages that fail to
                                      load: abort, ignore or skip (default
                                      abort)
  disableJavascript  <boolean\> - Do not allow web pages to run javascript 

  enableForms <boolean\> - Turn HTML form fields into pdf form fields

  disableExternalLinks <boolean\> - Do not make links to remote web pages
  
  noImages <boolean\> - Do not load or print images
  
  defaultHeader <boolean\> - Add a default header, with the name of the
                                      page to the left, and the page number to
                                      the right, this is short for:
                                      --header-left='[webpage]'
                                      --header-right='[page]/[toPage]' --top 2cm
                                      --header-line
                                      
  pageHeight <unitreal\> - Page height

  pageWidth <unitreal\> - Page width 

  pageSize  <Size\> - Set paper size to: A4, Letter, etc.
                    See available sizes [here](https://doc.qt.io/archives/qt-4.8/qprinter.html#PaperSize-enum)
                    
  marginBottom <unitreal\> - Set the page bottom margin

  marginTop <unitreal\> - Set the page top margin 

  marginRight <unitreal\> - Set the page right margin (default 10mm)

  marginLeft <unitreal\> - Set the page left margin (default 10mm)
  
  orientation <orientation\> - Set orientation to Landscape or Portrait (default Portrait)
  
  lowquality <boolean\> - Generates lower quality pdf. Useful to
                                      shrink the result document space
  
  minimumFontSize <size\> - Minimum font size
