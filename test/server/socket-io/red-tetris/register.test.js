import { io as Client } from 'socket.io-client';

// import { expect } from 'chai';
import {
  after,
  afterEach,
  before,
  describe,
  it,
} from 'mocha';

import { assert } from 'chai';
import { createTestServer } from '../../../helpers/server';

let testServer;
let clientSocket;

describe('Red-Tetris registration', () => {
  before((done) => {
    createTestServer().then((server) => {
      clientSocket = new Client(`http://${server.host}:${server.port}`);
      testServer = server;
      done();
    });
  });

  afterEach(() => testServer.engine.reset());

  after(() => testServer.stop());

  it('should register a player and respond with an id', (done) => {
    clientSocket.on('red-tetris:register', ({ type, playerId }) => {
      assert.equal(type, 'red-tetris/register');
      assert.isNotEmpty(playerId);
      done();
    });

    clientSocket.emit('red-tetris:register', { name: 'Bruce Wayne' });
  });
});
