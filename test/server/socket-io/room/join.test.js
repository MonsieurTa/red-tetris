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
import registerPlayer from '../../../helpers/socket-io';

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

  afterEach(() => testServer.engine.reset());

  after(() => testServer.stop());

  it('should not join an inexistant room', async () => {
    clientSocket.emit('red-tetris:register', { name: 'Bruce Wayne' });

    const playerId = await registerPlayer(clientSocket);

    clientSocket.emit('room:join', { playerId, roomId: '1234' });

    return new Promise((resolve) => {
      clientSocket.on('room:join', (arg) => {
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

    clientSocket.emit('red-tetris:register', { name: 'Clark Kent' });

    const playerId = await registerPlayer(clientSocket);

    clientSocket.emit('room:join', { playerId, roomId: '1234' });

    return new Promise((resolve) => {
      clientSocket.on('room:join', (arg) => {
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

    clientSocket.emit('red-tetris:register', { name: 'Clark Kent' });

    const playerId = await registerPlayer(clientSocket);

    clientSocket.emit('room:join', { playerId, roomId: '1234' });

    return new Promise((resolve) => {
      setTimeout(() => {
        clientSocket.emit('room:join', { playerId, roomId: '1234' });
        clientSocket.on('room:join', (arg) => {
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
    clientSocket.on('room:join', (arg) => {
      expect(arg).to.eql({ error: 'NotRegistered' });
      done();
    });
    clientSocket.emit('room:join', { roomId: '1234' });
  });
});
