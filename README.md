# Html-Project-to-pdf-service

# Not Ready

# Install

  ```sh
  git clone https://github.com/LonelySpaceDog/Html-Project-to-pdf-service
  cd Html-Project-to-pdf-service
  npm install
  ```

Port configuration in config.env Default *port is 5520*

# Deploy with docker 

change `EXPOSE` field in Dockerfile to desirable port.
than ```docker build --tag html-to-pdf-docker .```

To run docker with default port:

``` sh
docker run --publish 5520:5520 html-to-pdf-docker
```

# Routes

 `GET /` - get sample main page
 
 `POST /upload` - send form-data with enctype = multipart/form-data and file with name=html.zip field and get link to pdf file from json field
 
 `GET /:pdf` - get converted pdf with name from `POST /upload` response link

# Available query for */upload*
  
  EXAMPLE: `.../upload?noBackground=true&pageSize=A3`

  noBackground <boolean\> - Do not print background

  footerCenter/headerCenter <text\>  - Centered footer/header text

  footerFontSize/headerFontSize <size\>- Set footer/header font size (default 12)

  footerHtml/headerHtml <url\> - Adds a html footer

  footerLeft/headerLeft <text\> - Left aligned footer/header text

  footerLine/headerLine <boolean\> - Display line above the footer/header 

  footerRight/headerRight <text\> - Right aligned footer/header text

  footerSpacing/headerSpacing <real\> - Spacing between footer/header and content in mm (default 0)

  printMediaType  <boolean\> - Use print media-type instead of screen 

  disableJavascript  <boolean\> - Do not allow web pages to run javascript 

  enableForms <boolean\> - Turn HTML form fields into pdf form fields

  disableExternalLinks <boolean\> - Do not make links to remote web pages
  
  noImages <boolean\> - Do not load or print images
  
  defaultHeader <boolean\> - Add a default header, with the the page number to the right
                                      
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
