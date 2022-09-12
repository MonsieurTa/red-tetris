import { io as Client } from 'socket.io-client';
import { getRedTetrisSingleton, Room } from '../../src/server/entities';

import { createTestServer } from '../helpers/server';
import { registerPlayer, waitEvent } from '../helpers/socket-io';
import EVENTS from '../../src/shared/constants/socket-io';
import Player from '../../src/server/entities/Player';

describe('Room joining', () => {
  let redTetris;
  let testServer;
  let clientSocket;

  beforeAll(async () => {
    await createTestServer()
      .then((server) => {
        clientSocket = new Client(`http://${server.host}:${server.port}`);
        testServer = server;
        redTetris = getRedTetrisSingleton();
      });
  });

  afterEach(() => getRedTetrisSingleton().reset());

  afterAll(() => {
    clientSocket.close();
    setTimeout(() => testServer.stop(), 100);
  });

  it('should join a room', async () => {
    const dummyPlayer = new Player('Bruce Wayne');
    const room = new Room({ name: '1234', host: dummyPlayer, capacity: 3 });
    room.addPlayer(dummyPlayer);
    getRedTetrisSingleton().storeRoom(room);

    const player = await registerPlayer(clientSocket, { username: 'Clark Kent' });

    clientSocket.emit(EVENTS.ROOM.JOIN, { playerId: player.id, id: room.id });

    const joinedRoom = await waitEvent(clientSocket, EVENTS.ROOM.JOIN);

    expect(joinedRoom.id).toEqual('1234');
    expect(joinedRoom.players.length).toEqual(2);
  });

  it('should not join an inexistant room', async () => {
    const player = await registerPlayer(clientSocket, { username: 'Bruce Wayne' });

    clientSocket.emit(EVENTS.ROOM.JOIN, { playerId: player.id, name: '1234' });

    const event = await waitEvent(clientSocket, EVENTS.COMMON.ERROR);
    expect(event.error).toEqual('ERR_NOT_FOUND');
  });

  it('should not join if room is full', async () => {
    const dummyPlayer = new Player('Bruce Wayne');
    const room = new Room({ id: '1234', host: dummyPlayer, capacity: 1 });
    room.addPlayer(dummyPlayer);

    redTetris.storeRoom(room);

    const player = await registerPlayer(clientSocket, { username: 'Clark Kent' });

    clientSocket.emit(EVENTS.ROOM.JOIN, { playerId: player.id, id: room.id });

    const event = await waitEvent(clientSocket, EVENTS.COMMON.ERROR);

    expect(event.error).toEqual('ERR_IS_FULL');
  });

  it('should not join if already added', async () => {
    const dummyPlayer = new Player('Bruce Wayne');
    const room = new Room({ id: '1234', host: dummyPlayer, capacity: 3 });
    getRedTetrisSingleton().storeRoom(room);

    const player = await registerPlayer(clientSocket, { username: 'Clark Kent' });

    clientSocket.emit(EVENTS.ROOM.JOIN, { playerId: player.id, id: room.id });
    room.addPlayer(player);

    const event = await waitEvent(clientSocket, EVENTS.COMMON.ERROR);

    expect(event.error).toEqual('ERR_ALREADY_ADDED');
  });

  it('should respond with an error if not registered', async () => {
    clientSocket.emit(EVENTS.ROOM.JOIN, { name: '1234' });
    const event = await waitEvent(clientSocket, EVENTS.ROOM.JOIN);

    expect(event.error).toEqual('NotRegistered');
  });
});
