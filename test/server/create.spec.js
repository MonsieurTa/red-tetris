import { io as Client } from 'socket.io-client';

import { getRedTetrisSingleton, Room } from '../../src/server/entities';

import { createTestServer } from '../helpers/server';
import { registerPlayer, wait, waitEvent } from '../helpers/socket-io';
import EVENTS from '../../src/shared/constants/socket-io';
import Player from '../../src/server/entities/Player';

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

  afterAll(async () => {
    clientSocket.close();

    await wait();
    testServer.stop();
  });

  it('should create room with host', async () => {
    const player = await registerPlayer(clientSocket, { username: 'Bruce Wayne' });

    clientSocket.emit(EVENTS.ROOM.CREATE, { playerId: player.id, name: '1234' });

    const room = await waitEvent(clientSocket, EVENTS.ROOM.CREATE);

    expect(room.host.username).toEqual('Bruce Wayne');
    expect(room.id).toEqual('1234');
    expect(room.capacity).toEqual(5);
  });

  it('should join room if name already exist', async () => {
    const storedRoom = new Room({
      name: '1234',
      host: new Player('Clark Kent'),
    });

    getRedTetrisSingleton().storeRoom(storedRoom);

    const player = await registerPlayer(clientSocket, { username: 'Bruce Wayne' });

    clientSocket.emit(EVENTS.ROOM.CREATE, { playerId: player.id, name: '1234' });
    const room = await waitEvent(clientSocket, EVENTS.ROOM.JOIN);

    expect(storedRoom.id).toEqual(room.id);
  });

  it('should respond with an error', async () => {
    clientSocket.emit(EVENTS.ROOM.CREATE, { name: '1234' });
    const event = await waitEvent(clientSocket, EVENTS.ROOM.CREATE);

    expect(event.error).toEqual('NotRegistered');
  });
});
