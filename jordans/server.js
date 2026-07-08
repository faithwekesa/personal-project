const http = require('http');
const fs = require('fs');
const path = require('path');
const PORT = 3000;

const server = http.createServer(function(req, res) {
    let filePath;
    let contentType = 'text/html';
    let extname = path.extname(req.url);

    if (extname === '.png' || extname === '.jpg' || extname === '.jpeg' || extname === '.webp') {
        filePath = path.join(__dirname, 'main', req.url);
        if (extname === '.png') contentType = 'image/png';
        if (extname === '.jpg' || extname === '.jpeg') contentType = 'image/jpeg';
        if (extname === '.webp') contentType = 'image/webp';
    } else {
        filePath = path.join(__dirname, 'main', req.url === '/' ? 'js.html' : req.url);
        if (extname === '.css') contentType = 'text/css';
        if (extname === '.js') contentType = 'text/javascript';
    }

    fs.readFile(filePath, function(error, content) {
        if (error) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>Asset Matrix Not Found</h1>', 'utf-8');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
});

server.listen(PORT, function() {
    console.log("Sneaker Showcase streaming live on http://localhost:" + PORT);
});
