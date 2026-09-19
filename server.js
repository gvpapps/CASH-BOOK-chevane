const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = 8080;
const DIR = __dirname;

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

  const filePath = path.join(DIR, reqPath);
  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Server Error: ' + err.message);
    } else {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*'
      });
      res.end(content);
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  const ip = getLocalIp();
  console.log('===============================================================');
  console.log(' शाळा सादील खर्च व कॅश बुक व्यवस्थापन प्रणाली (Mobile Server)');
  console.log('===============================================================');
  console.log('');
  console.log(' मोबाईलवर वापरण्यासाठी:');
  console.log('   आपल्या मोबाईलच्या Chrome ब्राऊझरमध्ये खालील लिंक टाका:');
  console.log('');
  console.log('   👉 http://' + ip + ':' + PORT);
  console.log('');
  console.log(' संगणकावर वापरण्यासाठी:');
  console.log('   👉 http://localhost:' + PORT);
  console.log('');
  console.log(' टीप: आपला मोबाईल आणि कॉम्प्युटर एकाच Wi-Fi / Hotspot वर असावेत.');
  console.log('===============================================================');
});
