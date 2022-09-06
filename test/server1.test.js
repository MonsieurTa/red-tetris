import { io as Client } from 'socket.io-client';

import { assert } from 'chai';
import {
  after,
  afterEach,
  before,
  describe,
  it,
} from 'mocha';
import { EVENTS } from '../src/shared/constants/socket-io';import { createTestServer } from './helpers/server';
import { getRedTetrisSingleton } from '../src/server/entities';

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

  afterEach(() => getRedTetrisSingleton().reset());

  after(() => testServer.stop());

  it('should pong', (done) => {
    clientSocket.on('ping', ({ type }) => {
      assert.equal(type, 'pong');
      done();
    });

    clientSocket.emit(EVENTS.RED_TETRIS.REGISTER, { username: 'Clark Kent' });
    clientSocket.emit('ping', { type: 'server/ping' });
  });
});
