// with { "type": "module" } in your package.json
import { io as Client } from 'socket.io-client';
import { assert } from 'chai';
import {
  after,
  before,
  describe,
  it,
} from 'mocha';

import createServer from '../src/server/index';
import params, { HOST, PORT } from '../params';

describe('Socket', () => {
  let testServer;
  let clientSocket;

  before((done) => {
    createServer(params.server).then((server) => {
      testServer = server;
      clientSocket = new Client(`http://${HOST}:${PORT}`);
      clientSocket.on('connect', done);
    });
  });

  after(() => {
    testServer.stop();
    clientSocket.close();
  });

  it('should pong', (done) => {
    clientSocket.on('action', ({ type }) => {
      assert.equal(type, 'pong');
      done();
    });

    clientSocket.emit('action', { type: 'server/ping' });
  });
});
