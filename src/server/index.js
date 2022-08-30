import path from 'path';
import fs from 'fs';
import debug from 'debug';

import { StatusCodes } from 'http-status-codes';

import http from 'http';
import { Server } from 'socket.io';

const logerror = debug('tetris:error');
const loginfo = debug('tetris:info');

const serveClient = (req, res) => {
  const file = req.url === '/bundle.js' ? '/../../build/bundle.js' : '/../../index.html';

  fs.readFile(path.join(__dirname, file), (err, data) => {
    if (err) {
      logerror(err);
      res.writeHead(StatusCodes.INTERNAL_SERVER_ERROR);
      res.end('Error loading index.html');
      return;
    }

    res.writeHead(StatusCodes.OK);
    res.end(data);
  });
};

const createServer = (params) => {
  const { host, port } = params;
  return new Promise((resolve) => {
    const httpServer = http.createServer();

    httpServer.on('request', serveClient);

    httpServer.listen({ host, port }, () => {
      loginfo(`tetris listen on ${params.url}`);

      const io = new Server(httpServer);

      const stop = () => {
        io.close();
        httpServer.close(() => httpServer.unref());
        loginfo('Engine stopped.');
      };

      io.on('connection', (socket) => {
        loginfo(`Socket connected: ${socket.id}`);
        socket.on('action', (action) => {
          if (action.type === 'server/ping') {
            socket.emit('action', { type: 'pong' });
          }
        });
      });
      resolve({ httpServer, io, stop });
    });
  });
};

export default createServer;
