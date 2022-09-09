import { io as Client } from 'socket.io-client';

import actions from '../../../shared/actions/redux';
import EVENTS from '../../../shared/constants/socket-io';
import constants from '../../../shared/constants';

import {
  register,
  setRooms,
  setCurrentRoom,
  setGameState,
  addRoom,
  removeRoom,
  setRoomGame,
} from '../reducers/red-tetris';

let socket = null;

export const socketIoListenerMiddleware = (store) => (next) => (action) => {
  switch (action.type) {
    case constants.redux.WEBSOCKET.CONNECT:
      if (socket) {
        socket.close();
      }
      socket = new Client(action.host);

      socket.on(EVENTS.COMMON.CONNECT, () => store.dispatch(actions.WEBSOCKET.connected()));
      socket.on(
        EVENTS.COMMON.CONNECT.CONNECT_ERROR,
        () => store.dispatch(actions.WEBSOCKET.connectError()),
      );
      socket.on(
        EVENTS.COMMON.CONNECT.DISCONNECT,
        () => store.dispatch(actions.WEBSOCKET.disconnected()),
      );

      // register all listeners here
      // ...
      socket.on(EVENTS.RED_TETRIS.REGISTER, (player) => {
        window.localStorage.setItem('_player', player);
        store.dispatch(register(player));
      });

      socket.on(EVENTS.RED_TETRIS.ROOMS, (rooms) => {
        store.dispatch(setRooms(rooms));
      });

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
        if (room.error) return;
        store.dispatch(setCurrentRoom(room));
      });

      socket.on(EVENTS.ROOM.LEAVE, (room) => {
        store.dispatch(setCurrentRoom(room));
      });

      socket.on(EVENTS.GAME.READY, (game) => {
        store.dispatch({ type: EVENTS.GAME.START, gameId: game.id });
      });

      socket.on(EVENTS.GAME.STATE, (gameState) => {
        store.dispatch(setGameState(gameState));
      });

      socket.on(EVENTS.GAME.OTHERS_STATE, (otherBoard) => {
        store.dispatch(setRoomGame(otherBoard));
      });

      return null;
    case constants.redux.WEBSOCKET.DISCONNECT:
      if (socket) {
        socket.close();
      }

      socket = null;
      return null;
    default:
      return next(action);
  }
};

export const socketIoEmitterMiddleware = (store) => (next) => (action) => {
  switch (action.type) {
    case EVENTS.RED_TETRIS.REGISTER:
      socket.emit(EVENTS.RED_TETRIS.REGISTER, { username: action.username });
      return null;
    case EVENTS.ROOM.CREATE:
      socket.emit(EVENTS.ROOM.CREATE, {
        playerId: store.getState().player.id,
        name: action.name,
      });
      return null;
    case EVENTS.ROOM.JOIN:
      socket.emit(EVENTS.ROOM.JOIN, {
        playerId: store.getState().player.id,
        id: action.id,
      });
      return null;
    case EVENTS.ROOM.LEAVE:
      socket.emit(EVENTS.ROOM.LEAVE, {
        playerId: store.getState().player.id,
        roomId: action.roomId,
      });
      store.dispatch(setCurrentRoom(null));
      return null;
    case EVENTS.ROOM.READY:
      socket.emit(EVENTS.ROOM.READY, {
        playerId: store.getState().player.id,
        id: action.id,
      });
      return null;
    case EVENTS.GAME.START:
      socket.emit(EVENTS.GAME.START, {
        playerId: store.getState().player.id,
        gameId: action.gameId,
      });
      return null;
    case EVENTS.GAME.ACTION:
      if (!store.getState().player) return null;

      socket.emit(EVENTS.GAME.ACTION, {
        playerId: store.getState().player.id,
        action: action.action,
        status: action.status,
      });
      return null;
    default:
      return next(action);
  }
};
