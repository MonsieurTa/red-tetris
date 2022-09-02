import { io as Client } from 'socket.io-client';

// import { expect } from 'chai';
import {
  after,
  afterEach,
  before,
  describe,
  it,
} from 'mocha';

import { assert, expect } from 'chai';
import { createTestServer } from '../../../helpers/server';
import { DEFAULT_SEQUENCE } from '../../../../src/server/entities/PieceGenerator';
import registerPlayer from '../../../helpers/socket-io';

let testServer;
let clientSocket;

describe('Game drawing', () => {
  before((done) => {
    createTestServer().then((server) => {
      clientSocket = new Client(`http://${server.host}:${server.port}`);
      testServer = server;
      done();
    });
  });

  afterEach(() => testServer.engine.reset());

  after(() => testServer.stop());

  it('should draw first sequence pieces', async () => {
    clientSocket.emit('red-tetris:register', { name: 'Bruce Wayne' });

    const playerId = await registerPlayer(clientSocket);

    clientSocket.on('game:start', ({ gameId }) => {
      clientSocket.emit('game:draw', { playerId, gameId, i: 0 });
    });

    clientSocket.emit('room:create', { playerId, roomId: '1234' });
    clientSocket.emit('game:start', { playerId, roomId: '1234' });

    return new Promise((resolve) => {
      clientSocket.on('game:draw', ({ type, pieces }) => {
        assert.equal(type, 'game/draw');
        expect(pieces.sort()).to.eql(DEFAULT_SEQUENCE.split('').sort());
        resolve();
      });
    });
  });

  it('should draw any sequence pieces', async () => {
    const drawCount = 4;

    clientSocket.emit('red-tetris:register', { name: 'Bruce Wayne' });

    const playerId = await registerPlayer(clientSocket);

    clientSocket.on('game:start', ({ gameId }) => {
      for (let i = 0; i < drawCount; i += 1) {
        clientSocket.emit('game:draw', { playerId, gameId, i });
      }
    });

    clientSocket.emit('room:create', { playerId, roomId: '1234' });
    clientSocket.emit('game:start', { playerId, roomId: '1234' });

    return new Promise((resolve) => {
      let count = 0;

      clientSocket.on('game:draw', ({ type, pieces }) => {
        assert.equal(type, 'game/draw');
        expect(pieces.sort()).to.eql(DEFAULT_SEQUENCE.split('').sort());
        count += 1;

        if (count === drawCount) resolve();
      });
    });
  });

  it('should draw same pieces for different socket clients', async () => {
    const drawCount = 4;
    const clarkSocket = new Client(`http://${testServer.host}:${testServer.port}`);

    clientSocket.emit('red-tetris:register', { name: 'Bruce Wayne' });
    clarkSocket.emit('red-tetris:register', { name: 'Clark Kent' });

    const [bruceId, clarkId] = await Promise.all([
      registerPlayer(clientSocket),
      registerPlayer(clarkSocket),
    ]);

    clientSocket.on('game:start', ({ gameId }) => {
      for (let i = 0; i < drawCount; i += 1) {
        clientSocket.emit('game:draw', { playerId: bruceId, gameId, i });
      }
    });

    clarkSocket.on('game:start', ({ gameId }) => {
      for (let i = 0; i < drawCount; i += 1) {
        clarkSocket.emit('game:draw', { playerId: clarkId, gameId, i });
      }
    });

    clientSocket.on('room:create', () => {
      clarkSocket.emit('room:join', { playerId: clarkId, roomId: '1234' });
    });

    clarkSocket.on('room:join', () => {
      clientSocket.emit('game:start', { playerId: bruceId, roomId: '1234' });
    });

    clientSocket.emit('room:create', { playerId: bruceId, roomId: '1234', maxPlayers: 4 });

    const getPieces = (socket) => new Promise((resolve) => {
      const result = [];
      socket.on('game:draw', ({ pieces }) => {
        result.push(pieces);
        if (result.length === drawCount) resolve({ result });
      });
    });

    const [brucePieces, clarkPieces] = await Promise.all([
      getPieces(clientSocket),
      getPieces(clarkSocket),
    ]);

    expect(brucePieces).to.eql(clarkPieces);
  });
});
