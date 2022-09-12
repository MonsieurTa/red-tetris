import { io as Client } from 'socket.io-client';

import {
  after,
  afterEach,
  before,
  describe,
  it,
} from 'mocha';

import { assert } from 'chai';
import { createTestServer } from '../helpers/server';
import { getRedTetrisSingleton } from '../../src/server/entities';
import { registerPlayer } from '../helpers/socket-io';

let testServer;
let clientSocket;

describe('Red-Tetris registration', () => {
  before((done) => {
    createTestServer().then((server) => {
      clientSocket = new Client(`http://${server.host}:${server.port}`);
      testServer = server;
      done();
    });
  });

  afterEach(() => getRedTetrisSingleton().reset());

  after(() => {
    clientSocket.close();
    setTimeout(() => testServer.stop(), 100);
  });

  it('should register a player and respond with an id', async () => {
    const player = await registerPlayer(clientSocket, { username: 'Bruce Wayne' });

    assert.equal(player.username, 'Bruce Wayne');
  });
});
