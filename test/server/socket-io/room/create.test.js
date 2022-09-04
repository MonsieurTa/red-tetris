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

  after(() => testServer.stop());

  it('should create room with host', async () => {
    clientSocket.emit('red-tetris:register', { name: 'Bruce Wayne' });

    const playerId = await registerPlayer(clientSocket);

    clientSocket.emit('room:create', { playerId, roomId: '1234' });

    return new Promise((resolve) => {
      clientSocket.on('room:create', (arg) => {
        expect(arg).to.eql({
          type: 'room/create',
          roomId: '1234',
          isHost: true,
        });
        resolve();
      });
    });
  });

  it('should find already created room', async () => {
    getRedTetrisSingleton().storeRoom(new Room({ id: '1234', host: 'dummyHost' }));

    clientSocket.emit('red-tetris:register', { name: 'Bruce Wayne' });

    const playerId = await registerPlayer(clientSocket);
    clientSocket.emit('room:create', { playerId, roomId: '1234' });

    return new Promise((resolve) => {
      clientSocket.on('room:create', (arg) => {
        expect(arg).to.eql({
          type: 'room/create',
          roomId: '1234',
          isHost: false,
        });
        resolve();
      });
    });
  });

  it('should respond with an error', (done) => {
    clientSocket.on('room:create', (arg) => {
      expect(arg).to.eql({ error: 'NotRegistered' });
      done();
    });

    clientSocket.emit('room:create', { roomId: '1234' });
  });
});
