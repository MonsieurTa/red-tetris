import { io as Client } from 'socket.io-client';

import { assert, expect } from 'chai';
import {
  after,
  afterEach,
  before,
  describe,
  it,
} from 'mocha';
import { getRedTetrisSingleton, Room } from '../../../../src/server/entities';

import { createTestServer } from '../../../helpers/server';
import { registerPlayer, waitEvent } from '../../../helpers/socket-io';
import EVENTS from '../../../../src/shared/constants/socket-io';
import Player from '../../../../src/server/entities/Player';

describe('Room joining', () => {
  let redTetris;
  let testServer;
  let clientSocket;

  before((done) => {
    createTestServer().then((server) => {
      clientSocket = new Client(`http://${server.host}:${server.port}`);
      testServer = server;
      redTetris = getRedTetrisSingleton();
      done();
    });
  });

  afterEach(() => getRedTetrisSingleton().reset());

  after(() => testServer.stop());

  it('should not join an inexistant room', async () => {
    const player = await registerPlayer(clientSocket, { username: 'Bruce Wayne' });

    clientSocket.emit(EVENTS.ROOM.JOIN, { playerId: player.id, name: '1234' });

    const event = await waitEvent(clientSocket, EVENTS.ROOM.JOIN);
    assert.equal(event.error, 'ERR_NOT_FOUND');
  });

  it('should not join if room is full', async () => {
    const dummyPlayer = new Player('Bruce Wayne');
    const room = new Room({ id: '1234', host: dummyPlayer, capacity: 1 });
    room.addPlayer(dummyPlayer);

    redTetris.storeRoom(room);

    const player = await registerPlayer(clientSocket, { username: 'Clark Kent' });

    clientSocket.emit(EVENTS.ROOM.JOIN, { playerId: player.id, id: room.id });

    const event = await waitEvent(clientSocket, EVENTS.ROOM.JOIN);
    assert.equal(event.error, 'ERR_IS_FULL');
  });

  it('should not join if already added', async () => {
    const dummyPlayer = new Player('Bruce Wayne');
    const room = new Room({ id: '1234', host: dummyPlayer, capacity: 3 });
    getRedTetrisSingleton().storeRoom(room);

    const player = await registerPlayer(clientSocket, { username: 'Clark Kent' });

    clientSocket.emit(EVENTS.ROOM.JOIN, { playerId: player.id, id: room.id });
    room.addPlayer(player);

    const event = await waitEvent(clientSocket, EVENTS.ROOM.JOIN);
    assert.equal(event.error, 'ERR_ALREADY_ADDED');
  });

  it('should respond with an error if not registered', (done) => {
    clientSocket.on(EVENTS.ROOM.JOIN, (arg) => {
      expect(arg).to.eql({ error: 'NotRegistered' });
      done();
    });
    clientSocket.emit(EVENTS.ROOM.JOIN, { name: '1234' });
  });
});
