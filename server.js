const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3001;
const CONTENT_FILE = path.join(__dirname, 'content.json');

// Helper to read content
const getSiteContent = () => {
    try {
        if (fs.existsSync(CONTENT_FILE)) {
            return fs.readFileSync(CONTENT_FILE, 'utf8');
        }
    } catch (err) {
        console.error('Error reading content file:', err);
    }
    return JSON.stringify({});
};

http.createServer((req, res) => {
    // API Routes
    if (req.url.startsWith('/api/content')) {
        if (req.method === 'GET') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(getSiteContent());
        }

        if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk.toString(); });
            req.on('end', () => {
                try {
                    const data = JSON.parse(body);
                    // Simple validation: check for a password or token if you want, 
                    // but for now we'll rely on the admin panel password logic 
                    // and just save the content data.
                    fs.writeFileSync(CONTENT_FILE, JSON.stringify(data, null, 2));
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true }));
                } catch (err) {
                    res.writeHead(400);
                    res.end(JSON.stringify({ error: 'Invalid JSON' }));
                }
            });
            return;
        }
    }

    // Static File Server
    let requestUrl = req.url.split('?')[0];
    let filePath = '.' + requestUrl;
    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code == 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>', 'utf-8');
            }
            else {
                res.writeHead(500);
                res.end('Server error: ' + error.code);
            }
        }
        else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });

}).listen(port);

console.log(`Server running at http://localhost:${port}/`);
