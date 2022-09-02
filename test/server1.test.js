import { io as Client } from 'socket.io-client';

import { assert } from 'chai';
import {
  after,
  afterEach,
  before,
  describe,
  it,
} from 'mocha';
import { createTestServer } from './helpers/server';

describe('Fake server test', () => {
  let testServer;
  let clientSocket;

  before((done) => {
    createTestServer().then((server) => {
      clientSocket = new Client(`http://${server.host}:${server.port}`);
      testServer = server;
      done();
    });
  });

  afterEach(() => testServer.engine.reset());

  after(() => testServer.stop());

  it('should pong', (done) => {
    clientSocket.on('ping', ({ type }) => {
      assert.equal(type, 'pong');
      done();
    });

    clientSocket.emit('red-tetris:register', { name: 'Clark Kent' });
    clientSocket.emit('ping', { type: 'server/ping' });
  });
});
