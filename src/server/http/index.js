import path from 'path';
import fs from 'fs';
import debug from 'debug';

import { StatusCodes } from 'http-status-codes';

const logerror = debug('tetris:error');

const serveClientHandler = (req, res) => {
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

const registerHttpHandlers = (httpServer) => {
  httpServer.on('request', serveClientHandler);
};

export default registerHttpHandlers;
