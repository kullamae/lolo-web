const http = require('http')
const fs = require('fs')
const path = require('path')
const Mercury = require('@postlight/mercury-parser');
const FeedHandler = require('./FeedHandler')
const port = process.env.PORT || 4000

http.createServer((request, response) => {
  let filePath = '.' + request.url

  if (filePath == './') {
    filePath = './index.html';
  } else if (filePath == './feed') {
    return FeedHandler.getFeedData().then(result => {
      response.end(JSON.stringify(result))
    });
  } else if (filePath == './article') {
    return new Promise( () => {
      if (request.method === 'POST') {
        let requestBody = ''
        request.on('data', chunk => {
          requestBody += chunk.toString()
        });
        request.on('end', async () => {
          const link = JSON.parse(requestBody).link
          if (link) {
            const result = await Mercury.parse(link)
            response.end(JSON.stringify(result))
          } else {
            response.end('Link not found')
          }
        })
      }
    })
  }

  const extension = String(path.extname(filePath)).toLowerCase()
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
  }
  const contentType = mimeTypes[extension] || 'application/octet-stream'

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        fs.readFile('./404.html', (error, content) => {
          response.writeHead(404, { 'Content-Type': 'text/html' })
          response.end(content, 'utf-8')
        })
      } else {
        response.writeHead(500)
        response.end('Server error: ' + error.code)
      }
    } else {
      response.writeHead(200, { 'Content-Type': contentType })
      response.end(content, 'utf-8')
    }
  })
}).listen(port, () => {
  console.log(`Server running on port ${port}`)
})