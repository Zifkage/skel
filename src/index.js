import '@babel/polyfill';
import http from 'http';

const requestHandler = function handler(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello Nazif');
};

const server = http.createServer(requestHandler);
server.listen(8080);
