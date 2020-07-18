const http = require('http');
const fs = require('fs');
const path = require('path');
const port = 4000;

http.createServer(function (request, response) {
  let filePath = '.' + request.url

  if (filePath == './') {
    filePath = './index.html';
  }
  const extension = String(path.extname(filePath)).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
  };
  const contentType = mimeTypes[extension] || 'application/octet-stream';
  fs.readFile(filePath, function(error, content) {
    if (error) {
      if (error.code === 'ENOENT') {
        fs.readFile('./404.html', function(error, content) {
          response.writeHead(404, { 'Content-Type': 'text/html' });
          response.end(content, 'utf-8');
        });
      }
      else {
        response.writeHead(500);
        response.end('Server error: ' + error.code);
      }
    }
    else {
      response.writeHead(200, { 'Content-Type': contentType });
      response.end(content, 'utf-8');
    }
  });
}).listen(port, function(){
  console.log(`Server running on port ${port}`);
});