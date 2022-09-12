import { io as Client } from 'socket.io-client';

import { assert, expect } from 'chai';
import {
  after,
  afterEach,
  before,
  describe,
  it,
} from 'mocha';
import { getRedTetrisSingleton, Room } from '../../src/server/entities';

import { createTestServer } from '../helpers/server';
import { registerPlayer, waitEvent } from '../helpers/socket-io';
import EVENTS from '../../src/shared/constants/socket-io';
import Player from '../../src/server/entities/Player';

let testServer;
let clientSocket;

describe('Room creation', () => {
  before((done) => {
    createTestServer().then((server) => {
      clientSocket = new Client(`http://${server.host}:${server.port}`);
      testServer = server;
      done();
    });
  });

  afterEach(() => getRedTetrisSingleton().reset());

  after(() => {
    clientSocket.close();
    setTimeout(() => testServer.stop(), 100);
  });

  it('should create room with host', async () => {
    const player = await registerPlayer(clientSocket, { username: 'Bruce Wayne' });

    clientSocket.emit(EVENTS.ROOM.CREATE, { playerId: player.id, name: '1234' });

    const room = await waitEvent(clientSocket, EVENTS.ROOM.CREATE);

    assert.equal(room.host.username, 'Bruce Wayne');
    assert.equal(room.id, '1234');
    assert.equal(room.capacity, 5);
  });

  it('should join room if name already exist', async () => {
    const storedRoom = new Room({
      name: '1234',
      host: new Player('Clark Kent'),
    });

    getRedTetrisSingleton().storeRoom(storedRoom);

    const player = await registerPlayer(clientSocket, { username: 'Bruce Wayne' });

    clientSocket.emit(EVENTS.ROOM.CREATE, { playerId: player.id, name: '1234' });
    const room = await waitEvent(clientSocket, EVENTS.ROOM.JOIN);
    assert.equal(storedRoom.id, room.id);
  });

  it('should respond with an error', (done) => {
    clientSocket.on(EVENTS.ROOM.CREATE, (arg) => {
      expect(arg).to.eql({ error: 'NotRegistered' });
      done();
    });

    clientSocket.emit(EVENTS.ROOM.CREATE, { name: '1234' });
  });
});
