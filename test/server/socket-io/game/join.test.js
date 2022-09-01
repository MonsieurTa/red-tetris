import { expect } from 'chai';
import {
  after,
  afterEach,
  before,
  describe,
  it,
} from 'mocha';
import { getRedTetrisSingleton } from '../../../../src/server/entities';

import { createTestServer } from '../../../helpers/server';

describe('Game joining', () => {
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
    getRedTetrisSingleton().createGame('1234', { host: 'Bruce Wayne', maxPlayers: 1 });

    clientSocket.on('game:join', (arg) => {
      expect(arg).to.eql({
        type: 'game/join',
        gameId: '1234',
        error: 'ERR_IS_FULL',
      });
      done();
    });

    clientSocket.emit('game:join', { gameId: '1234', playerName: 'Clark Kent' });
  });

  it('should not join if already added', (done) => {
    getRedTetrisSingleton().createGame('1234', { host: 'Bruce Wayne', maxPlayers: 3 }).addPlayer('Clark Kent');

    clientSocket.on('game:join', (arg) => {
      expect(arg).to.eql({
        type: 'game/join',
        gameId: '1234',
        playerName: 'Clark Kent',
        error: 'ERR_ALREADY_ADDED',
      });
      done();
    });

    clientSocket.emit('game:join', { gameId: '1234', playerName: 'Clark Kent' });
  });
});
