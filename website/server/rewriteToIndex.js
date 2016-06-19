const fs = require('fs');

module.exports = (req, res, next) => {
  // Check for the file in the distribution folder
  let filePath = './dist' + req.url;

  // Strip off the query string
  filePath = filePath.split('?')[0];

  fs.exists(filePath, (exists) => {
    // If the file exists (aka it's a local resource), serve it
    if (exists) {
      return next();
    }

    // Otherwise, redirect to the index.html file and let the router handle it
    const index = './dist/index.html';

    fs.readFile(index, (error, content) => {
      if (error) {
        console.error('Error reading index.html file:', error);  // eslint-disable-line no-console
      } else {
        res.writeHead(200, {
          'Content-Type': 'text/html'
        });
        res.end(content, 'utf-8');
      }
    });
  });
};
