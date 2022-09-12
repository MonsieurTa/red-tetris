import { io as Client } from 'socket.io-client';

import { createTestServer } from '../helpers/server';
import { getRedTetrisSingleton } from '../../src/server/entities';
import { registerPlayer } from '../helpers/socket-io';

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

  afterAll(() => {
    clientSocket.close();
    setTimeout(() => testServer.stop(), 100);
  });

  it('should register a player and respond with an id', async () => {
    const player = await registerPlayer(clientSocket, { username: 'Bruce Wayne' });

    expect(player.username).toEqual('Bruce Wayne');
  });
});
