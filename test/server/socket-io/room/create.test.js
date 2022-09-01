import { expect } from 'chai';
import {
  after,
  afterEach,
  before,
  describe,
  it,
} from 'mocha';
import { getGameSingleton } from '../../../../src/server/entities';

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

  it('should create room with host', (done) => {
    clientSocket.on('room:create', (arg) => {
      expect(arg).to.eql({
        type: 'room/create',
        gameId: '1234',
        isHost: true,
      });
      done();
    });

    clientSocket.emit('room:create', { gameId: '1234', playerName: 'Bruce Wayne' });
  });

  it('should find already created room', (done) => {
    getGameSingleton().createRoom('1234', { host: 'Bruce Wayne' });

    clientSocket.on('room:create', (arg) => {
      expect(arg).to.eql({
        type: 'room/create',
        gameId: '1234',
        isHost: false,
      });
      done();
    });

    clientSocket.emit('room:create', { gameId: '1234', playerName: 'Clark Kent' });
  });
});
