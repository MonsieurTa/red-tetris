import { assert } from 'chai';
import {
  after,
  before,
  describe,
  it,
} from 'mocha';
import { createTestServer } from './helpers/server';

describe('Fake server test', () => {
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

  it('should pong', (done) => {
    clientSocket.on('action', ({ type }) => {
      assert.equal(type, 'pong');
      done();
    });

    clientSocket.emit('action', { type: 'server/ping' });
  });
});
