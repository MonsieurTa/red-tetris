import { createSlice } from '@reduxjs/toolkit';
import { DEFAULT_GAME_STATE } from '../../../shared/constants/redux';

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
      gameState: DEFAULT_GAME_STATE,
      roomGames: {},
    }),
    setGameState: (state, { payload: gameState }) => ({ ...state, gameState }),
    setRoomGame: (state, { payload: roomGame }) => {
      const { roomGames } = state;
      return ({ ...state, roomGames: { ...roomGames, [roomGame.id]: roomGame } });
    },
    setError: (state, { payload: error }) => ({ ...state, error }),
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
  setError,
} = redTetrisSlice.actions;
export default redTetrisSlice.reducer;
