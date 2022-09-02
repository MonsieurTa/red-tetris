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

  afterEach(() => testServer.engine.reset());

  after(() => testServer.stop());

  it('should create room with host', (done) => {
    clientSocket.on('room:create', (arg) => {
      expect(arg).to.eql({
        type: 'room/create',
        roomId: '1234',
        isHost: true,
      });
      done();
    });
    clientSocket.emit('red-tetris:register', { name: 'Bruce Wayne ' });
    clientSocket.emit('room:create', { roomId: '1234' });
  });

  it('should find already created room', (done) => {
    getRedTetrisSingleton().addRoom(new Room({ id: '1234', host: 'dummyHost' }));

    clientSocket.on('room:create', (arg) => {
      expect(arg).to.eql({
        type: 'room/create',
        roomId: '1234',
        isHost: false,
      });
      done();
    });
    clientSocket.emit('red-tetris:register', { name: 'Bruce Wayne ' });
    clientSocket.emit('room:create', { roomId: '1234' });
  });

  it('should respond with an error', (done) => {
    clientSocket.on('room:create', (arg) => {
      expect(arg).to.eql({ error: 'NotRegistered' });
      done();
    });

    clientSocket.emit('room:create', { roomId: '1234' });
  });
});
