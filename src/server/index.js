import debug from 'debug';

import http from 'http';
import registerHttpHandlers from './http';
import createSocketIoServer from './socket-io';

const loginfo = debug('tetris:info');

const createServer = (params) => {
  const { host, port } = params;
  return new Promise((resolve) => {
    const httpServer = http.createServer();

    registerHttpHandlers(httpServer);

    httpServer.listen({ host, port }, () => {
      loginfo(`tetris listen on ${params.url}`);

      const { io: serverSocket, stop } = createSocketIoServer(httpServer, { loginfo });

      resolve({ httpServer, serverSocket, stop });
    });
  });
};

export default createServer;
