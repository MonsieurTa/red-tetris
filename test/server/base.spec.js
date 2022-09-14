import { io as Client } from 'socket.io-client';
import { getRedTetrisSingleton } from '../../src/server/entities';

import { createTestServer } from '../helpers/server';
import { registerPlayer } from '../helpers/socket-io';

let testServer;
let clientSocket;

describe('Room creation', () => {
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

  it('should end test normally', async () => {
    await registerPlayer(clientSocket, { username: 'Bruce Wayne' });
  });
});