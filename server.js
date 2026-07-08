const http = require('http');
const fs = require('fs');
const path = require('path');
const PORT = 3000;

const DB_FILE = path.join(__dirname, 'database.json');

let savedData = {
    waterAmount: 0.0,
    waterGoal: "4.0",
    routinePlans: [],
    buttonStates: [],
    extraTasks: [],
    meals: [],
    mealInputs: []
};

if (fs.existsSync(DB_FILE)) {
    try {
        const fileContent = fs.readFileSync(DB_FILE, 'utf8');
        savedData = JSON.parse(fileContent);
        console.log("Database file synced and loaded successfully!");
    } catch (e) {
        console.log("Initializing database storage schema...");
    }
}

const server = http.createServer(function(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.url === '/api/tracker') {
        if (req.method === 'GET') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(savedData));
        } else if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk.toString(); });
            req.on('end', () => {
                try {
                    savedData = JSON.parse(body);
                    fs.writeFileSync(DB_FILE, JSON.stringify(savedData, null, 2), 'utf8');
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: "Changes recorded permanently!" }));
                } catch (e) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: "Invalid JSON format payload" }));
                }
            });
        }
        return;
    }

    let filePath = path.join(__dirname, 'public', req.url === '/' ? 'tracker.html' : req.url);
    let extname = path.extname(filePath);
    let contentType = 'text/html';

    if (extname === '.css') contentType = 'text/css';
    if (extname === '.js') contentType = 'text/javascript';

    fs.readFile(filePath, function(error, content) {
        if (error) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>File Not Found</h1>', 'utf-8');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, function() {
    console.log("Server successfully running on http://localhost:" + PORT);
});
