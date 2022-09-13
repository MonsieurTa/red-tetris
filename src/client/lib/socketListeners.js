import EVENTS from '../../shared/constants/socket-io';
import {
  addRoom,
  register,
  removeRoom,
  setCurrentRoom,
  setGameState,
  setRoomGame,
  setRooms,
} from '../redux/reducers/red-tetris';

export const registerRedTetrisListeners = (socket, store) => {
  socket.on(EVENTS.RED_TETRIS.REGISTER, (player) => {
    store.dispatch(register(player));
  });

  socket.on(EVENTS.RED_TETRIS.ROOMS, (rooms) => {
    store.dispatch(setRooms(rooms));
  });
};

export const registerRoomListeners = (socket, store) => {
  socket.on(EVENTS.ROOM.CREATE, (room) => {
    if (room.host?.id === store.getState().player?.id) {
      store.dispatch(setCurrentRoom(room));
    }
    store.dispatch(addRoom(room));
  });

  socket.on(EVENTS.ROOM.REMOVED, ({ id }) => {
    store.dispatch(removeRoom(id));
  });

  socket.on(EVENTS.ROOM.JOIN, (room) => {
    store.dispatch(setCurrentRoom(room));
  });

  socket.on(EVENTS.ROOM.LEAVE, (room) => {
    store.dispatch(setCurrentRoom(room));
  });
};

export const registerGameListeners = (socket, store) => {
  socket.on(EVENTS.GAME.READY, (game) => {
    store.dispatch({ type: EVENTS.GAME.START, gameId: game.id });
  });

  socket.on(EVENTS.GAME.STATE, (gameState) => {
    store.dispatch(setGameState(gameState));
  });

  socket.on(EVENTS.GAME.OTHERS_STATE, (otherBoard) => {
    store.dispatch(setRoomGame(otherBoard));
  });
};
