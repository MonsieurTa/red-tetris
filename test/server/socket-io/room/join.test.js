import { io as Client } from 'socket.io-client';

import { expect } from 'chai';
import {
  after,
  afterEach,
  before,
  describe,
  it,
} from 'mocha';
import { getRedTetrisSingleton, Room } from '../../../../src/server/entities';

import { createTestServer } from '../../../helpers/server';

describe('Room joining', () => {
  let redTetris;
  let testServer;
  let clientSocket;

  before((done) => {
    createTestServer().then((server) => {
      clientSocket = new Client(`http://${server.host}:${server.port}`);
      testServer = server;
      redTetris = getRedTetrisSingleton();
      done();
    });
  });

  afterEach(() => testServer.engine.reset());

  after(() => testServer.stop());

  it('should not join an inexistant room', (done) => {
    clientSocket.on('room:join', (arg) => {
      expect(arg).to.eql({
        type: 'room/join',
        roomId: '1234',
        error: 'ERR_NOT_FOUND',
      });
      done();
    });
    clientSocket.emit('red-tetris:register', { name: 'Bruce Wayne ' });
    clientSocket.emit('room:join', { roomId: '1234' });
  });

  it('should not join if room is full', (done) => {
    const room = new Room({ id: '1234', host: 'dummyHostId', maxPlayers: 1 });
    room.addPlayerId('dummyHostId');

    redTetris.storeRoom(room);

    clientSocket.on('room:join', (arg) => {
      expect(arg).to.eql({
        type: 'room/join',
        roomId: '1234',
        error: 'ERR_IS_FULL',
      });
      done();
    });

    clientSocket.emit('red-tetris:register', { name: 'Clark Kent' });
    clientSocket.emit('room:join', { roomId: '1234' });
  });

  it('should not join if already added', (done) => {
    getRedTetrisSingleton().storeRoom(new Room({ id: '1234', host: 'dummySocketId', maxPlayers: 3 }));

    clientSocket.emit('red-tetris:register', { name: 'Clark Kent' });
    clientSocket.emit('room:join', { roomId: '1234' });

    setTimeout(() => {
      clientSocket.on('room:join', (arg) => {
        expect(arg).to.eql({
          type: 'room/join',
          roomId: '1234',
          error: 'ERR_ALREADY_ADDED',
        });
        done();
      });
      clientSocket.emit('room:join', { roomId: '1234' });
    }, 250);
  });

  it('should respond with an error if not registered', (done) => {
    clientSocket.on('room:join', (arg) => {
      expect(arg).to.eql({ error: 'NotRegistered' });
      done();
    });
    clientSocket.emit('room:join', { roomId: '1234' });
  });
});
