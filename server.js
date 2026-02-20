const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3001;
const CONTENT_FILE = path.join(__dirname, 'content.json');
const DYNAMIC_CONTENT_FILE = path.join(__dirname, 'dynamic-content.json');

// Helper to read content
const getSiteContent = () => {
    try {
        if (fs.existsSync(DYNAMIC_CONTENT_FILE)) {
            return fs.readFileSync(DYNAMIC_CONTENT_FILE, 'utf8');
        }
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
    if (req.url.startsWith('/api/')) {
        const setCorsHeaders = () => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        };

        if (req.method === 'OPTIONS') {
            setCorsHeaders();
            res.writeHead(204);
            return res.end();
        }

        // Helper: Check Auth
        const checkAuth = (req) => {
            const AUTH_FILE = path.join(__dirname, 'auth.json');
            try {
                if (fs.existsSync(AUTH_FILE)) {
                    const auth = JSON.parse(fs.readFileSync(AUTH_FILE, 'utf8'));
                    const authHeader = req.headers['authorization'];

                    // Simple "Bearer <password>" check (for simplicity in this no-db setup)
                    // In a bigger app, use JWTs. Here, the "token" is just the password for now, or we could generate a token.
                    // Given the client-side logic, we'll accept the password directly as the token for this iteration.
                    if (authHeader && authHeader === `Bearer ${auth.password}`) {
                        return true;
                    }
                }
            } catch (err) {
                console.error('Auth error:', err);
            }
            return false;
        };

        // LOGIN Endpoint
        if (req.url === '/api/login' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk.toString(); });
            req.on('end', () => {
                try {
                    const { password } = JSON.parse(body);
                    const AUTH_FILE = path.join(__dirname, 'auth.json');

                    if (fs.existsSync(AUTH_FILE)) {
                        const storedAuth = JSON.parse(fs.readFileSync(AUTH_FILE, 'utf8'));
                        if (password === storedAuth.password) {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            return res.end(JSON.stringify({ success: true, token: password }));
                        }
                    }

                    // Default fallback if file missing
                    if (password === '1234') {
                        // Auto-create auth file if missing and using default
                        const initialPassword = 'InitialSecurePassword123!';
                        console.log('--------------------------------------------------');
                        console.log('NOTICE: Auth file created with initial password:', initialPassword);
                        console.log('Please login with this password and change it immediately.');
                        console.log('--------------------------------------------------');

                        fs.writeFileSync(AUTH_FILE, JSON.stringify({ password: initialPassword }));
                        res.writeHead(401, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ error: 'Default password disabled. Check server logs for initial password.' }));
                    }

                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid password' }));
                } catch (e) {
                    res.writeHead(400);
                    res.end(JSON.stringify({ error: 'Bad Request' }));
                }
            });
            return;
        }

        // CONTENT Endpoint
        if (req.url === '/api/content') {
            if (req.method === 'GET') {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                return res.end(getSiteContent());
            }

            if (req.method === 'POST') {
                if (!checkAuth(req)) {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: 'Unauthorized' }));
                }

                let body = '';
                req.on('data', chunk => { body += chunk.toString(); });
                req.on('end', () => {
                    try {
                        const data = JSON.parse(body);
                        // Write to dynamic file to avoid git conflicts
                        fs.writeFileSync(DYNAMIC_CONTENT_FILE, JSON.stringify(data, null, 2));
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

        // PASSWORD CHANGE Endpoint
        if (req.url === '/api/password' && req.method === 'POST') {
            if (!checkAuth(req)) {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Unauthorized' }));
            }

            let body = '';
            req.on('data', chunk => { body += chunk.toString(); });
            req.on('end', () => {
                const { newPassword } = JSON.parse(body);
                if (!newPassword || newPassword.length < 8) {
                    res.writeHead(400);
                    return res.end(JSON.stringify({ error: 'Password must be at least 8 characters' }));
                }

                const AUTH_FILE = path.join(__dirname, 'auth.json');
                fs.writeFileSync(AUTH_FILE, JSON.stringify({ password: newPassword }));

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
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
