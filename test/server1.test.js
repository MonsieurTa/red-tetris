import { assert } from 'chai';
import {
  after,
  afterEach,
  before,
  describe,
  it,
} from 'mocha';
import { createTestServer } from './helpers/server';

describe('Fake server test', () => {
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

  it('should pong', (done) => {
    clientSocket.on('ping', ({ type }) => {
      assert.equal(type, 'pong');
      done();
    });

    clientSocket.emit('ping', { type: 'server/ping' });
  });
});
