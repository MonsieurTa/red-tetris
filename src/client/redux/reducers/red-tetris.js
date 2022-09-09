import { createSlice } from '@reduxjs/toolkit';
import { HEIGHT, initBoard, WIDTH } from '../../../shared/helpers/board';

const redTetrisSlice = createSlice({
  name: 'red-tetris',
  reducers: {
    setSocket: (state, { payload: socket }) => ({ ...state, socket }),
    register: (state, { payload: player }) => ({ ...state, player }),
    setRooms: (state, { payload: rooms }) => ({ ...state, rooms }),
    addRoom: (state, { payload: room }) => ({
      ...state,
      rooms: [room, ...state.rooms],
    }),
    removeRoom: (state, { payload: roomId }) => ({
      ...state,
      rooms: state.rooms.filter(({ id }) => id !== roomId),
    }),
    setCurrentRoom: (state, { payload: currentRoom }) => ({
      ...state,
      currentRoom,
      board: initBoard(WIDTH, HEIGHT),
      roomGames: {},
    }),
    setGameState: (state, { payload: gameState }) => ({ ...state, ...gameState }),
    setRoomGame: (state, { payload: roomGame }) => {
      const { roomGames } = state;
      return ({ ...state, roomGames: { ...roomGames, [roomGame.id]: roomGame } });
    },
    join: (state) => state,
    ready: (state) => state,

    startGame: (state) => state,
    board: (state) => state,
  },
});

export const {
  setSocket,
  register,
  setRooms,
  addRoom,
  removeRoom,
  setCurrentRoom,
  setGameState,
  setCurrentPiece,
  setRoomGame,
} = redTetrisSlice.actions;
export default redTetrisSlice.reducer;
