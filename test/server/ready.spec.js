import { io as Client } from 'socket.io-client';

import { createTestServer } from '../helpers/server';
import {
  registerPlayer, createRoom, joinRoom, waitEvent,
} from '../helpers/socket-io';
import { getRedTetrisSingleton } from '../../src/server/entities';
import EVENTS from '../../src/shared/constants/socket-io';

let testServer;
let clientSocket;

describe('Room ready', () => {
  beforeAll((done) => {
    createTestServer().then((server) => {
      clientSocket = new Client(`http://${server.host}:${server.port}`);
      testServer = server;
      done();
    });
  });

  afterEach(() => getRedTetrisSingleton().reset());

  afterAll(() => {
    clientSocket.close();
    setTimeout(() => testServer.stop(), 100);
  });

  it('should start a game with one player', async () => {
    const player = await registerPlayer(clientSocket, { username: 'Bruce Wayne' });

    clientSocket.emit(EVENTS.ROOM.CREATE, { playerId: player.id, name: '1234' });
    const room = await waitEvent(clientSocket, EVENTS.ROOM.CREATE);

    clientSocket.emit(EVENTS.ROOM.READY, { playerId: player.id, id: room.id });
    const game = await waitEvent(clientSocket, EVENTS.GAME.READY);

    clientSocket.emit(EVENTS.GAME.START, { playerId: player.id, gameId: game.id });
    const gameState = await waitEvent(clientSocket, EVENTS.GAME.STATE);

    expect(gameState.id).not.toBeNull();
    expect(gameState.board).not.toBeNull();
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
      waitEvent(clientSocket, EVENTS.GAME.READY),
      waitEvent(clarkSocket, EVENTS.GAME.READY),
      waitEvent(spiderManSocket, EVENTS.GAME.READY),
      waitEvent(ironManSocket, EVENTS.GAME.READY),
    ]);

    expect(events.length).toEqual(4);
    events.forEach((event) => {
      expect(event).not.toBeNull();
    });

    const [
      bruceGameId,
      clarkGameId,
      spiderManGameId,
      ironManGameId,
    ] = events.map(({ id }) => id);

    clientSocket.emit(EVENTS.GAME.START, { playerId: bruce.id, gameId: bruceGameId });
    clarkSocket.emit(EVENTS.GAME.START, { playerId: clark.id, gameId: clarkGameId });
    spiderManSocket.emit(EVENTS.GAME.START, { playerId: spiderMan.id, gameId: spiderManGameId });
    ironManSocket.emit(EVENTS.GAME.START, { playerId: ironMan.id, gameId: ironManGameId });

    await Promise.all([
      waitEvent(clientSocket, EVENTS.GAME.STATE),
      waitEvent(clarkSocket, EVENTS.GAME.STATE),
      waitEvent(spiderManSocket, EVENTS.GAME.STATE),
      waitEvent(ironManSocket, EVENTS.GAME.STATE),
    ]);

    clarkSocket.close();
    spiderManSocket.close();
    ironManSocket.close();
  });
});
