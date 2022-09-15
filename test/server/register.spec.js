import { io as Client } from 'socket.io-client';

import { createTestServer } from '../helpers/server';
import { getRedTetrisSingleton } from '../../src/server/entities';
import { registerPlayer, wait } from '../helpers/socket-io';

let testServer;
let clientSocket;

describe('Red-Tetris registration', () => {
  beforeAll((done) => {
    createTestServer().then((server) => {
      clientSocket = new Client(`http://${server.host}:${server.port}`);
      testServer = server;
      done();
    });
  });

  afterEach(() => getRedTetrisSingleton().reset());

  afterAll(async () => {
    clientSocket.close();

    await wait();
    testServer.stop();
  });

  it('should register a player and respond with an id', async () => {
    const player = await registerPlayer(clientSocket, { username: 'Bruce Wayne' });

    expect(player.username).toEqual('Bruce Wayne');
  });
});
