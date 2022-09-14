import EVENTS from '../../shared/constants/socket-io';
import {
  addRoom,
  register,
  removeRoom,
  setCurrentRoom,
  setGameState,
  setRoomGame,
  setRoomRunning,
  setRooms,
} from '../redux/reducers/red-tetris';

export const onRegister = (store) => (player) => store.dispatch(register(player));
export const onRooms = (store) => (rooms) => store.dispatch(setRooms(rooms));

export const onRoomCreate = (store) => (room) => {
  if (room.host?.id === store.getState().player?.id) {
    store.dispatch(setCurrentRoom(room));
  }
  store.dispatch(addRoom(room));
};
export const onRoomRemove = (store) => ({ id }) => store.dispatch(removeRoom(id));
export const onRoomJoin = (store) => (room) => store.dispatch(setCurrentRoom(room));
export const onRoomLeave = (store) => (room) => store.dispatch(setCurrentRoom(room));

export const onGameReady = (store) =>
  (game) => {
    store.dispatch({ type: EVENTS.GAME.START, gameId: game.id });
    store.dispatch(setRoomRunning(true));
  };
export const onGameState = (store) => (gameState) => store.dispatch(setGameState(gameState));
export const onGameOtherState = (store) =>
  (otherBoard) => store.dispatch(setRoomGame(otherBoard));
export const onGameEnd = (store) => () => store.dispatch(setRoomRunning(false));

export const registerRedTetrisListeners = (socket, store) => {
  socket.on(EVENTS.RED_TETRIS.REGISTER, onRegister(store));
  socket.on(EVENTS.RED_TETRIS.ROOMS, onRooms(store));
};

export const registerRoomListeners = (socket, store) => {
  socket.on(EVENTS.ROOM.CREATE, onRoomCreate(store));
  socket.on(EVENTS.ROOM.REMOVED, onRoomRemove(store));
  socket.on(EVENTS.ROOM.JOIN, onRoomJoin(store));
  socket.on(EVENTS.ROOM.LEAVE, onRoomLeave(store));
};

export const registerGameListeners = (socket, store) => {
  socket.on(EVENTS.GAME.READY, onGameReady(store));
  socket.on(EVENTS.GAME.STATE, onGameState(store));
  socket.on(EVENTS.GAME.OTHERS_STATE, onGameOtherState(store));
  socket.on(EVENTS.GAME.END, onGameEnd(store));
};
