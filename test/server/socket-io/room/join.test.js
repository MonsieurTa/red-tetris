import { io as Client } from 'socket.io-client';

import { expect } from 'chai';
import {
  after,
  afterEach,
  before,
  describe,
  it,
} from 'mocha';
import { getRedTetrisSingleton, Room } from '../../../../src/server/entities';

import { createTestServer } from '../../../helpers/server';
import { registerPlayer } from '../../../helpers/socket-io';
import { EVENTS } from '../../../../src/shared/constants';

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
    const playerId = await registerPlayer(clientSocket, { name: 'Bruce Wayne' });

    clientSocket.emit(EVENTS.ROOM.JOIN, { playerId, roomId: '1234' });

    return new Promise((resolve) => {
      clientSocket.on(EVENTS.ROOM.JOIN, (arg) => {
        expect(arg).to.eql({
          type: 'room/join',
          roomId: '1234',
          error: 'ERR_NOT_FOUND',
        });
        resolve();
      });
    });
  });

  it('should not join if room is full', async () => {
    const room = new Room({ id: '1234', host: 'dummyHostId', maxPlayers: 1 });
    room.addPlayerId('dummyHostId');

    redTetris.storeRoom(room);

    const playerId = await registerPlayer(clientSocket, { name: 'Clark Kent' });

    clientSocket.emit(EVENTS.ROOM.JOIN, { playerId, roomId: '1234' });

    return new Promise((resolve) => {
      clientSocket.on(EVENTS.ROOM.JOIN, (arg) => {
        expect(arg).to.eql({
          type: 'room/join',
          roomId: '1234',
          error: 'ERR_IS_FULL',
        });
        resolve();
      });
    });
  });

  it('should not join if already added', async () => {
    getRedTetrisSingleton().storeRoom(new Room({ id: '1234', host: 'dummySocketId', maxPlayers: 3 }));

    const playerId = await registerPlayer(clientSocket, { name: 'Clark Kent' });

    clientSocket.emit(EVENTS.ROOM.JOIN, { playerId, roomId: '1234' });

    return new Promise((resolve) => {
      setTimeout(() => {
        clientSocket.emit(EVENTS.ROOM.JOIN, { playerId, roomId: '1234' });
        clientSocket.on(EVENTS.ROOM.JOIN, (arg) => {
          expect(arg).to.eql({
            type: 'room/join',
            roomId: '1234',
            error: 'ERR_ALREADY_ADDED',
          });
          resolve();
        });
      }, 250);
    });
  });

  it('should respond with an error if not registered', (done) => {
    clientSocket.on(EVENTS.ROOM.JOIN, (arg) => {
      expect(arg).to.eql({ error: 'NotRegistered' });
      done();
    });
    clientSocket.emit(EVENTS.ROOM.JOIN, { roomId: '1234' });
  });
});
