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

  it('should start a game with one player', (done) => {
    clientSocket.on('game:start', ({ type, gameId }) => {
      assert.equal(type, 'game/start');
      expect(gameId.startsWith('1234')).to.be.true;
      done();
    });

    clientSocket.emit('red-tetris:register', { name: 'Bruce Wayne' });
    clientSocket.emit('room:create', { roomId: '1234' });
    clientSocket.emit('game:start', { roomId: '1234' });
  });

  it('should start a game with multiple players', (done) => {
    const clarkSocket = new Client(`http://${testServer.host}:${testServer.port}`);
    const spiderManSocket = new Client(`http://${testServer.host}:${testServer.port}`);
    const ironManSocket = new Client(`http://${testServer.host}:${testServer.port}`);

    clientSocket.emit('red-tetris:register', { name: 'Bruce Wayne' });
    clarkSocket.emit('red-tetris:register', { name: 'Clark Kent' });
    spiderManSocket.emit('red-tetris:register', { name: 'Spider Man' });
    ironManSocket.emit('red-tetris:register', { name: 'Iron Man' });

    clientSocket.emit('room:create', { roomId: '1234', maxPlayers: 4 });

    setTimeout(() => {
      clarkSocket.emit('room:join', { roomId: '1234' });
      spiderManSocket.emit('room:join', { roomId: '1234' });
      ironManSocket.emit('room:join', { roomId: '1234' });

      clientSocket.emit('game:start', { roomId: '1234' });

      const gameStartResolver = (socket) => new Promise((resolve) => {
        socket.on('game:start', (arg) => {
          assert.equal(arg.type, 'game/start');
          expect(arg.gameId.startsWith('1234#')).to.be.true;
          resolve(arg.gameId);
        });
      });

      const promises = [
        clientSocket,
        clarkSocket,
        spiderManSocket,
        ironManSocket,
      ].map(gameStartResolver);

      Promise.all(promises)
        .then((gameIds) => {
          // assert gameIds uniqueness
          assert.equal(new Set(gameIds).size, promises.length);
          done();
        });
    }, 250);
  });
});
