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
    const player = await registerPlayer(clientSocket, { username: 'Bruce Wayne' });

    clientSocket.emit(EVENTS.ROOM.CREATE, { playerId: player.id, name: '1234' });
    const room = await waitEvent(clientSocket, EVENTS.ROOM.CREATE);

    clientSocket.emit(EVENTS.ROOM.READY, { playerId: player.id, id: room.id });
    // const room = await waitEvent(clientSocket, EVENTS.ROOM.READY);

    const game = await waitEvent(clientSocket, EVENTS.GAME.READY);

    clientSocket.emit(EVENTS.GAME.START, { playerId: player.id, gameId: game.id });
    const gameReady = await waitEvent(clientSocket, EVENTS.GAME.START);
    assert.deepEqual(game, gameReady);
  });

  it('should start a game with multiple players', async () => {
    const clarkSocket = new Client(`http://${testServer.host}:${testServer.port}`);
    const spiderManSocket = new Client(`http://${testServer.host}:${testServer.port}`);
    const ironManSocket = new Client(`http://${testServer.host}:${testServer.port}`);

    const [bruce, clark, spiderMan, ironMan] = await Promise.all([
      registerPlayer(clientSocket, { username: 'Bruce Wayne' }),
      registerPlayer(clarkSocket, { username: 'Clark Kent' }),
      registerPlayer(spiderManSocket, { username: 'Spider Man' }),
      registerPlayer(ironManSocket, { username: 'Iron Man' }),
    ]);
    const room = await createRoom(clientSocket, { playerId: bruce.id, name: '1234', capacity: 4 });

    await Promise.all([
      joinRoom(clarkSocket, { playerId: clark.id, id: room.id }),
      joinRoom(spiderManSocket, { playerId: spiderMan.id, id: room.id }),
      joinRoom(ironManSocket, { playerId: ironMan.id, id: room.id }),
    ]);

    clientSocket.emit(EVENTS.ROOM.READY, { playerId: bruce.id, id: room.id });

    const events = await Promise.all([
      waitEvent(clientSocket, EVENTS.ROOM.READY),
      waitEvent(clarkSocket, EVENTS.ROOM.READY),
      waitEvent(spiderManSocket, EVENTS.ROOM.READY),
      waitEvent(ironManSocket, EVENTS.ROOM.READY),
    ]);

    assert.equal(events.length, 4);
    events.forEach((event) => {
      assert.isNotNull(event);
    });
  });
});
