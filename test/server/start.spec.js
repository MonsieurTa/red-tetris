import { io as Client } from 'socket.io-client';

import { createTestServer } from '../helpers/server';
import {
  registerPlayer,
  waitEvent,
} from '../helpers/socket-io';
import { getRedTetrisSingleton } from '../../src/server/entities';
import EVENTS from '../../src/shared/constants/socket-io';

let testServer;
let clientSocket;

describe('Game starting', () => {
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

  it('should get initial red-tetris data', async () => {
    const player = await registerPlayer(clientSocket, { username: 'Bruce Wayne' });

    clientSocket.emit(EVENTS.ROOM.CREATE, { playerId: player.id, name: '1234' });
    const room = await waitEvent(clientSocket, EVENTS.ROOM.CREATE);

    clientSocket.emit(EVENTS.ROOM.READY, { playerId: player.id, id: room.id });

    const game = await waitEvent(clientSocket, EVENTS.GAME.READY);

    clientSocket.emit(EVENTS.GAME.START, { playerId: player.id, gameId: game.id });
    const state = await waitEvent(clientSocket, EVENTS.GAME.STATE);

    expect(state.id).not.toBeNull();
    expect(state.board).not.toBeNull();
  });
});
