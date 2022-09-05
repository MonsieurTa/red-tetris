import { io as Client } from 'socket.io-client';

import {
  after,
  afterEach,
  before,
  describe,
  it,
} from 'mocha';

import { assert, expect } from 'chai';
import { createTestServer } from '../../../helpers/server';
import {
  registerPlayer, createRoom, joinRoom, waitEvent,
} from '../../../helpers/socket-io';
import { getRedTetrisSingleton } from '../../../../src/server/entities';
import { initBoard } from '../../../../src/server/entities/Board';

let testServer;
let clientSocket;

describe('Room ready', () => {
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
    const playerId = await registerPlayer(clientSocket, { name: 'Bruce Wayne' });

    clientSocket.emit('room:create', { playerId, roomId: '1234' });
    clientSocket.emit('room:ready', { playerId, roomId: '1234' });

    const [
      gameStartEvent,
      gameBoardEvent,
    ] = await Promise.all([
      waitEvent(clientSocket, 'room:ready'),
      waitEvent(clientSocket, 'game:board'),
    ]);

    assert.equal(gameStartEvent.type, 'game/start');
    expect(gameStartEvent.gameId.startsWith('1234')).to.be.true;

    assert.equal(gameBoardEvent.type, 'game/board');
    expect(gameBoardEvent.board).to.eql(initBoard());
  });

  it('should start a game with multiple players', async () => {
    const clarkSocket = new Client(`http://${testServer.host}:${testServer.port}`);
    const spiderManSocket = new Client(`http://${testServer.host}:${testServer.port}`);
    const ironManSocket = new Client(`http://${testServer.host}:${testServer.port}`);

    const [bruceId, clarkId, spiderManId, ironManId] = await Promise.all([
      registerPlayer(clientSocket, { name: 'Bruce Wayne' }),
      registerPlayer(clarkSocket, { name: 'Clark Kent' }),
      registerPlayer(spiderManSocket, { name: 'Spider Man' }),
      registerPlayer(ironManSocket, { name: 'Iron Man' }),
    ]);

    const roomId = await createRoom(clientSocket, { playerId: bruceId, roomId: '1234', maxPlayers: 4 });

    await Promise.all([
      joinRoom(clarkSocket, { playerId: clarkId, roomId }),
      joinRoom(spiderManSocket, { playerId: spiderManId, roomId }),
      joinRoom(ironManSocket, { playerId: ironManId, roomId }),
    ]);

    clientSocket.emit('room:ready', { playerId: bruceId, roomId });

    const gameStartResolver = (socket) => new Promise((resolve) => {
      socket.on('room:ready', (arg) => {
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
