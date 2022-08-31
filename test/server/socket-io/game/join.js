import { assert } from 'chai';
import {
  after,
  before,
  describe,
  it,
} from 'mocha';

import { createTestServer } from '../../../helpers/server';

describe('Game', () => {
  let clientSocket;
  let stop;

  before((done) => {
    createTestServer().then((testServer) => {
      clientSocket = testServer.clientSocket;
      stop = testServer.stop;
      done();
    });
  });

  after(() => stop());

  it('should create game with one player', (done) => {
    const expectedGameId = '1234';
    const expectedPlayerName = 'Bruce Wayne';

    clientSocket.on('game:join', (arg) => {
      assert.equal(arg.type, 'game/join');
      assert.equal(arg.gameId, expectedGameId);
      assert.equal(arg.playerName, expectedPlayerName);
      done();
    });

    clientSocket.emit('game:join', { id: expectedGameId, playerName: expectedPlayerName });
  });
});
