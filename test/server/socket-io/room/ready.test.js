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

    const { type, gameId } = await waitEvent(clientSocket, 'room:ready');

    assert.equal(type, 'game/start');
    expect(gameId.startsWith('1234')).to.be.true;
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

    const events = await Promise.all([
      waitEvent(clientSocket, 'room:ready'),
      waitEvent(clarkSocket, 'room:ready'),
      waitEvent(spiderManSocket, 'room:ready'),
      waitEvent(ironManSocket, 'room:ready'),
    ]);

    events.forEach(({ type, gameId }) => {
      assert.equal(type, 'game/start');
      expect(gameId.startsWith('1234#')).to.be.true;
    });

    const gameIds = events.map(({ gameId }) => gameId);
    assert.equal(new Set(gameIds).size, gameIds.length);
  });
});
