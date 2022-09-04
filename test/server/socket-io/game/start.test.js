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
import registerPlayer from '../../../helpers/socket-io';
import { getRedTetrisSingleton } from '../../../../src/server/entities';

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

  afterEach(() => getRedTetrisSingleton().reset());

  after(() => testServer.stop());

  it('should start a game with one player', async () => {
    clientSocket.emit('red-tetris:register', { name: 'Bruce Wayne' });

    const playerId = await registerPlayer(clientSocket);

    clientSocket.emit('room:create', { playerId, roomId: '1234' });
    clientSocket.emit('game:start', { playerId, roomId: '1234' });

    return new Promise((resolve) => {
      clientSocket.on('game:start', ({ type, gameId }) => {
        assert.equal(type, 'game/start');
        expect(gameId.startsWith('1234')).to.be.true;
        resolve();
      });
    });
  });

  it('should start a game with multiple players', async () => {
    const clarkSocket = new Client(`http://${testServer.host}:${testServer.port}`);
    const spiderManSocket = new Client(`http://${testServer.host}:${testServer.port}`);
    const ironManSocket = new Client(`http://${testServer.host}:${testServer.port}`);

    clientSocket.emit('red-tetris:register', { name: 'Bruce Wayne' });
    clarkSocket.emit('red-tetris:register', { name: 'Clark Kent' });
    spiderManSocket.emit('red-tetris:register', { name: 'Spider Man' });
    ironManSocket.emit('red-tetris:register', { name: 'Iron Man' });

    const [bruceId, clarkId, spiderManId, ironManId] = await Promise.all([
      clientSocket,
      clarkSocket,
      spiderManSocket,
      ironManSocket,
    ].map(registerPlayer));

    clientSocket.emit('room:create', {
      playerId: bruceId, roomId: '1234', maxPlayers: 4,
    });

    clarkSocket.emit('room:join', { playerId: clarkId, roomId: '1234' });
    spiderManSocket.emit('room:join', { playerId: spiderManId, roomId: '1234' });
    ironManSocket.emit('room:join', { playerId: ironManId, roomId: '1234' });

    clientSocket.emit('game:start', { playerId: bruceId, roomId: '1234' });

    const gameStartResolver = (socket) => new Promise((resolve) => {
      socket.on('game:start', (arg) => {
        assert.equal(arg.type, 'game/start');
        expect(arg.gameId.startsWith('1234#')).to.be.true;
        resolve(arg.gameId);
      });
    });

    const gameIds = await Promise.all([
      clientSocket,
      clarkSocket,
      spiderManSocket,
      ironManSocket,
    ].map(gameStartResolver));

    assert.equal(new Set(gameIds).size, gameIds.length);
  });
});
