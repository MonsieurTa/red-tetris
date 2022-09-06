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
  registerPlayer,
  waitEvent,
} from '../../../helpers/socket-io';
import { getRedTetrisSingleton } from '../../../../src/server/entities';
import { initBoard } from '../../../../src/server/entities/Board';
import EVENTS from '../../../../src/shared/constants/socket-io';

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

  it('should get initial red-tetris data', async () => {
    const player = await registerPlayer(clientSocket, { username: 'Bruce Wayne' });

    clientSocket.emit(EVENTS.ROOM.CREATE, { playerId: player.id, name: '1234' });
    const room = await waitEvent(clientSocket, EVENTS.ROOM.CREATE);

    clientSocket.emit(EVENTS.ROOM.READY, { playerId: player.id, id: room.id });

    const [roomReadyEvent, game] = await Promise.all([
      waitEvent(clientSocket, EVENTS.ROOM.READY),
      waitEvent(clientSocket, EVENTS.GAME.READY),
    ]);

    assert.equal(roomReadyEvent.host.username, 'Bruce Wayne');
    assert.equal(roomReadyEvent.name, '1234');
    assert.equal(roomReadyEvent.capacity, 2);

    clientSocket.emit(EVENTS.GAME.START, { playerId: player.id, gameId: game.id });
    const [
      gameStartEvent,
      gameBoardEvent,
      gameCurrentPieceEvent,
    ] = await Promise.all([
      waitEvent(clientSocket, EVENTS.GAME.START),
      waitEvent(clientSocket, EVENTS.GAME.BOARD),
      waitEvent(clientSocket, EVENTS.GAME.CURRENT_PIECE),
    ]);

    assert.deepEqual(gameStartEvent, game);
    assert.deepEqual(gameBoardEvent.board, initBoard());

    assert.equal(gameCurrentPieceEvent.x, parseInt(gameCurrentPieceEvent.x, 10));
    assert.equal(gameCurrentPieceEvent.y, parseInt(gameCurrentPieceEvent.y, 10));
  });
});
