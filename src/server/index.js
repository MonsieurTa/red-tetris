import debug from 'debug';

import http from 'http';
import { getRedTetrisSingleton } from './entities';
import registerHttpHandlers from './http';
import createSocketIoServer from './socket-io';

const loginfo = debug('tetris:info');

const createServer = (params) => {
  const { host, port } = params;
  return new Promise((resolve) => {
    const httpServer = http.createServer();

    registerHttpHandlers(httpServer);

    httpServer.listen({ host, port }, () => {
      loginfo(`tetris listen on http://${host}:${port}`);

      const serverSocket = createSocketIoServer(httpServer, { loginfo });

      getRedTetrisSingleton().run();

      resolve({ httpServer, serverSocket });
    });
  });
};

export default createServer;
