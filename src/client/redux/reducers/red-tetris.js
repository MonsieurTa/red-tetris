import { createSlice } from '@reduxjs/toolkit';

const redTetrisSlice = createSlice({
  name: 'red-tetris',
  reducers: {
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
    setCreatedRoom: (state, { payload: createdRoom }) => ({ ...state, createdRoom }),
    setCurrentRoom: (state, { payload: currentRoom }) => ({
      ...state,
      currentRoom,
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
  register,
  setRooms,
  addRoom,
  removeRoom,
  setCreatedRoom,
  setCurrentRoom,
  setGameState,
  setCurrentPiece,
  setRoomGame,
} = redTetrisSlice.actions;
export default redTetrisSlice.reducer;
