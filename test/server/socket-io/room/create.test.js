import { expect } from 'chai';
import {
  after,
  afterEach,
  before,
  describe,
  it,
} from 'mocha';
import { getRedTetrisSingleton } from '../../../../src/server/entities';
import Player from '../../../../src/server/entities/Player';

import { createTestServer } from '../../../helpers/server';

let redTetris;
let testServer;
let clientSocket;

describe('Room creation', () => {
  before((done) => {
    createTestServer().then((server) => {
      clientSocket = server.clientSocket;
      testServer = server;
      redTetris = getRedTetrisSingleton();
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
    clientSocket.emit('room:create', { roomId: '1234', playerName: 'Bruce Wayne' });
  });

  it('should find already created room', (done) => {
    getRedTetrisSingleton().createRoom('1234', { host: 'Bruce Wayne' });

    clientSocket.on('room:create', (arg) => {
      expect(arg).to.eql({
        type: 'room/create',
        roomId: '1234',
        isHost: false,
      });
      done();
    });
    clientSocket.emit('red-tetris:register', { name: 'Bruce Wayne ' });
    clientSocket.emit('room:create', { roomId: '1234', playerName: 'Clark Kent' });
  });

  it('should respond with an error', (done) => {
    clientSocket.on('room:create', (arg) => {
      expect(arg).to.eql({ error: 'NotRegistered' });
      done();
    });

    clientSocket.emit('room:create', { roomId: '1234', playerName: 'Clark Kent' });
  });
});
