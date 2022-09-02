import { io as Client } from 'socket.io-client';

// import { expect } from 'chai';
import {
  after,
  afterEach,
  before,
  describe,
  it,
} from 'mocha';

import { assert, expect } from 'chai';
import { createTestServer } from '../../../helpers/server';

let testServer;
let clientSocket;

describe('Game starting', () => {
  before((done) => {
    createTestServer().then((server) => {
      clientSocket = new Client(`http://${server.host}:${server.port}`);
      testServer = server;
      done();
    });
  });

  afterEach(() => testServer.engine.reset());

  after(() => testServer.stop());

  it('should start a game', (done) => {
    clientSocket.on('game:start', ({ type, gameId }) => {
      assert.equal(type, 'game/start');
      expect(gameId.startsWith('1234')).to.be.true;
      done();
    });

    clientSocket.emit('red-tetris:register', { name: 'Bruce Wayne ' });
    clientSocket.emit('room:create', { roomId: '1234' });
    clientSocket.emit('game:start', { roomId: '1234' });
  });
});
