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

let testServer;
let clientSocket;

describe('Game creation', () => {
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

  it('should find already created game', (done) => {
    getRedTetrisSingleton().createGame('1234', { host: 'Bruce Wayne' });

    clientSocket.on('game:create', (arg) => {
      expect(arg).to.eql({
        type: 'game/create',
        gameId: '1234',
        isHost: false,
      });
      done();
    });

    clientSocket.emit('game:create', { gameId: '1234', playerName: 'Clark Kent' });
  });
});
