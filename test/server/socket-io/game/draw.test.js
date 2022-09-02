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

  it('should draw first sequence pieces', (done) => {
    clientSocket.on('game:start', ({ gameId }) => {
      clientSocket.emit('game:draw', { gameId, i: 0 });
    });

    clientSocket.on('game:draw', ({ type, pieces }) => {
      assert.equal(type, 'game/draw');
      expect(pieces.sort()).to.eql(DEFAULT_SEQUENCE.split('').sort());
      done();
    });

    clientSocket.emit('red-tetris:register', { name: 'Bruce Wayne' });
    clientSocket.emit('room:create', { roomId: '1234' });
    clientSocket.emit('game:start', { roomId: '1234' });
  });

  it('should draw any sequence pieces', (done) => {
    const drawCount = 4;

    clientSocket.on('game:start', ({ gameId }) => {
      for (let i = 0; i < drawCount; i += 1) {
        clientSocket.emit('game:draw', { gameId, i });
      }
    });

    clientSocket.emit('red-tetris:register', { name: 'Bruce Wayne' });
    clientSocket.emit('room:create', { roomId: '1234' });
    clientSocket.emit('game:start', { roomId: '1234' });

    new Promise((resolve) => {
      let count = 0;

      clientSocket.on('game:draw', ({ type, pieces }) => {
        assert.equal(type, 'game/draw');
        expect(pieces.sort()).to.eql(DEFAULT_SEQUENCE.split('').sort());
        count += 1;

        if (count === drawCount) resolve();
      });
    }).then(() => done());
  });

  it('should draw same pieces for different socket clients', (done) => {
    const clarkSocket = new Client(`http://${testServer.host}:${testServer.port}`);

    const drawCount = 4;

    clientSocket.on('game:start', ({ gameId }) => {
      for (let i = 0; i < drawCount; i += 1) {
        clientSocket.emit('game:draw', { gameId, i });
      }
    });

    clarkSocket.on('game:start', ({ gameId }) => {
      for (let i = 0; i < drawCount; i += 1) {
        clarkSocket.emit('game:draw', { gameId, i });
      }
    });

    clientSocket.emit('red-tetris:register', { name: 'Bruce Wayne' });
    clarkSocket.emit('red-tetris:register', { name: 'Clark Kent' });

    clientSocket.emit('room:create', { roomId: '1234', maxPlayers: 4 });

    setTimeout(async () => {
      clarkSocket.emit('room:join', { roomId: '1234' });

      clientSocket.emit('game:start', { roomId: '1234' });

      new Promise((resolve) => {
        const brucePieces = [];
        const clarkPieces = [];

        clientSocket.on('game:draw', ({ pieces }) => {
          brucePieces.push(pieces);
          if (brucePieces.length + clarkPieces.length === drawCount * 2) {
            resolve({ brucePieces, clarkPieces });
          }
        });

        clarkSocket.on('game:draw', ({ pieces }) => {
          clarkPieces.push(pieces);
          if (brucePieces.length + clarkPieces.length === drawCount * 2) {
            resolve({ brucePieces, clarkPieces });
          }
        });
      }).then(({
        brucePieces,
        clarkPieces,
      }) => {
        expect(brucePieces).to.eql(clarkPieces);
        done();
      });
    }, 250);
  });
});
