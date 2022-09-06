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
import EVENTS from '../../../../src/shared/constants/socket-io';
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
    const playerId = await registerPlayer(clientSocket, { username: 'Bruce Wayne' });

    clientSocket.emit(EVENTS.ROOM.CREATE, { playerId, roomId: '1234' });
    clientSocket.emit(EVENTS.ROOM.READY, { playerId, roomId: '1234' });

    const { type, gameId } = await waitEvent(clientSocket, EVENTS.ROOM.READY);

    assert.equal(type, 'room/ready');
    expect(gameId.startsWith('1234')).to.be.true;
  });

  it('should start a game with multiple players', async () => {
    const clarkSocket = new Client(`http://${testServer.host}:${testServer.port}`);
    const spiderManSocket = new Client(`http://${testServer.host}:${testServer.port}`);
    const ironManSocket = new Client(`http://${testServer.host}:${testServer.port}`);

    const [bruceId, clarkId, spiderManId, ironManId] = await Promise.all([
      registerPlayer(clientSocket, { username: 'Bruce Wayne' }),
      registerPlayer(clarkSocket, { username: 'Clark Kent' }),
      registerPlayer(spiderManSocket, { username: 'Spider Man' }),
      registerPlayer(ironManSocket, { username: 'Iron Man' }),
    ]);

    const roomId = await createRoom(clientSocket, { playerId: bruceId, roomId: '1234', maxPlayers: 4 });

    await Promise.all([
      joinRoom(clarkSocket, { playerId: clarkId, roomId }),
      joinRoom(spiderManSocket, { playerId: spiderManId, roomId }),
      joinRoom(ironManSocket, { playerId: ironManId, roomId }),
    ]);

    clientSocket.emit(EVENTS.ROOM.READY, { playerId: bruceId, roomId });

    const events = await Promise.all([
      waitEvent(clientSocket, EVENTS.ROOM.READY),
      waitEvent(clarkSocket, EVENTS.ROOM.READY),
      waitEvent(spiderManSocket, EVENTS.ROOM.READY),
      waitEvent(ironManSocket, EVENTS.ROOM.READY),
    ]);

    events.forEach(({ type, gameId }) => {
      assert.equal(type, 'room/ready');
      expect(gameId.startsWith('1234#')).to.be.true;
    });

    const gameIds = events.map(({ gameId }) => gameId);
    assert.equal(new Set(gameIds).size, gameIds.length);
  });
});
