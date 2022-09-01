import { assert, expect } from 'chai';
import {
  after,
  afterEach,
  before,
  describe,
  it,
} from 'mocha';

import { createTestServer } from '../../../helpers/server';

describe('Game', () => {
  let testServer;
  let clientSocket;

  before((done) => {
    createTestServer().then((server) => {
      clientSocket = server.clientSocket;
      testServer = server;
      done();
    });
  });

  afterEach(() => testServer.engine.reset());

  after(() => testServer.stop());

  it('should create game with host', (done) => {
    clientSocket.on('game:create', (arg) => {
      expect(arg).to.eql({
        type: 'game/create',
        gameId: '1234',
        isHost: true,
      });
      done();
    });

    clientSocket.emit('game:create', { gameId: '1234', playerName: 'Bruce Wayne' });
  });

  it('should not join an inexistant game', (done) => {
    clientSocket.on('game:join', (arg) => {
      expect(arg).to.eql({
        type: 'game/join',
        gameId: '1234',
        error: 'ERR_NOT_FOUND',
      });
      done();
    });

    clientSocket.emit('game:join', { gameId: '1234', playerName: 'Bruce Wayne' });
  });

  it('should not join if game is full', (done) => {
    clientSocket.on('game:join', (arg) => {
      expect(arg).to.eql({
        type: 'game/join',
        gameId: '1234',
        error: 'ERR_IS_FULL',
      });
      done();
    });

    clientSocket.emit('game:create', { gameId: '1234', playerName: 'Bruce Wayne', maxPlayers: 1 });
    clientSocket.emit('game:join', { gameId: '1234', playerName: 'Clark Kent' });
  });
});
