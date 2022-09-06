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
    const playerId = await registerPlayer(clientSocket, { username: 'Bruce Wayne' });

    clientSocket.emit(EVENTS.ROOM.CREATE, { playerId, name: '1234' });
    clientSocket.emit(EVENTS.ROOM.READY, { playerId, name: '1234' });

    const roomReadyEvent = await waitEvent(clientSocket, EVENTS.ROOM.READY);
    expect({
      type: roomReadyEvent.type,
      name: roomReadyEvent.name,
    }).to
      .eql({ type: 'room/ready', name: '1234' });
    expect(roomReadyEvent.gameId.startsWith('1234')).to.be.true;

    clientSocket.emit(EVENTS.GAME.START, { playerId, gameId: roomReadyEvent.gameId });

    const [
      gameStartEvent,
      gameBoardEvent,
      gameCurrentPieceEvent,
    ] = await Promise.all([
      waitEvent(clientSocket, EVENTS.GAME.START),
      waitEvent(clientSocket, EVENTS.GAME.BOARD),
      waitEvent(clientSocket, EVENTS.GAME.CURRENT_PIECE),
    ]);

    expect(gameStartEvent).to.eql({ type: 'game/start', gameId: roomReadyEvent.gameId });

    assert.equal(gameBoardEvent.type, 'game/board');
    expect(gameBoardEvent.board).to.eql(initBoard());

    assert.equal(gameCurrentPieceEvent.x, parseInt(gameCurrentPieceEvent.x, 10));
  });
});
