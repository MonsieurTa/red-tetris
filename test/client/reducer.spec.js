/**
 * @jest-environment jsdom
 */

import reducer, {
  setSocket,
  register,
  setRooms,
  addRoom,
  removeRoom,
  setCurrentRoom,
} from '../../src/client/redux/reducers/red-tetris';
import Player from '../../src/server/entities/Player';
import Room from '../../src/server/entities/Room';
import createRooms from '../helpers/entities';

import { INITIAL_STATE } from '../../src/shared/constants/redux';
import { HEIGHT, initBoard, WIDTH } from '../../src/shared/helpers/board';

it('should return initial state', () => {
  expect(reducer(undefined, { type: undefined })).toEqual({
    socket: null,
    rooms: [],
    currentRoom: null,
    player: null,
    roomGames: {},
    roomRunning: false,
    gameState: {
      id: null,
      player: null,
      board: initBoard(WIDTH, HEIGHT),
      score: 0,
      combo: 0,
      totalLineCleared: 0,
      level: 1,
      nextShapes: [],
    },
    error: null,
  });
});

it('should nullish socket', () => {
  const state = reducer(INITIAL_STATE.redTetris, setSocket(null));
  expect(state.socket).toBeNull();
});

it('should store player', () => {
  const player = new Player('Bruce Wayne').toDto();
  const state = reducer(INITIAL_STATE.redTetris, register(player));
  expect(state.player).toEqual(player);
});

it('should store rooms', () => {
  const rooms = createRooms();
  const state = reducer(INITIAL_STATE.redTetris, setRooms(rooms));
  expect(state.rooms).toEqual(rooms);
});

it('should add one room', () => {
  const state = reducer(INITIAL_STATE.redTetris, setRooms(createRooms()));
  const newRoom = new Room({ name: 'Nice', player: new Player('Bruce Wayne') });
  const newState = reducer(state, addRoom(newRoom));

  expect(newState.rooms.length).toEqual(11);
});

it('should remove one room', () => {
  const state = reducer(INITIAL_STATE.redTetris, setRooms(createRooms()));
  expect(state.rooms.length).toEqual(10);

  const newState = reducer(state, removeRoom('DefaultRoomName#1'));
  expect(newState.rooms.length).toEqual(9);
});

it('should set current room', () => {
  const [room] = createRooms(1);
  const state = reducer(INITIAL_STATE.redTetris, setCurrentRoom(room));
  expect(state.currentRoom).toEqual(room);
});
