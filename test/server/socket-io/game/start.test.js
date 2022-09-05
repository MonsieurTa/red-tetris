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
    const playerId = await registerPlayer(clientSocket, { name: 'Bruce Wayne' });

    clientSocket.emit('room:create', { playerId, roomId: '1234' });
    clientSocket.emit('room:ready', { playerId, roomId: '1234' });

    const roomReadyEvent = await waitEvent(clientSocket, 'room:ready');
    expect({
      type: roomReadyEvent.type,
      roomId: roomReadyEvent.roomId,
    }).to
      .eql({ type: 'room/ready', roomId: '1234' });
    expect(roomReadyEvent.gameId.startsWith('1234')).to.be.true;

    clientSocket.emit('game:start', { playerId, gameId: roomReadyEvent.gameId });

    const [
      gameStartEvent,
      gameBoardEvent,
      gameCurrentPieceEvent,
    ] = await Promise.all([
      waitEvent(clientSocket, 'game:start'),
      waitEvent(clientSocket, 'game:board'),
      waitEvent(clientSocket, 'game:current-piece'),
    ]);

    expect(gameStartEvent).to.eql({ type: 'game/start', gameId: roomReadyEvent.gameId });

    assert.equal(gameBoardEvent.type, 'game/board');
    expect(gameBoardEvent.board).to.eql(initBoard());

    assert.equal(gameCurrentPieceEvent.x, parseInt(gameCurrentPieceEvent.x, 10));
  });
});