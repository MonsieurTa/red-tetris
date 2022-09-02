import { expect } from 'chai';
import {
  after,
  afterEach,
  before,
  describe,
  it,
} from 'mocha';

import { createTestServer } from '../../../helpers/server';

let testServer;
let clientSocket;

describe('Room creation', () => {
  before((done) => {
    createTestServer().then((server) => {
      clientSocket = server.clientSocket;
      testServer = server;
      done();
    });
  });

  afterEach(() => testServer.engine.reset());

  after(() => testServer.stop());

  it('should start a game', (done) => {
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
});
