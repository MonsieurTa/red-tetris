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
    setCurrentRoom: (state, { payload: currentRoom }) => ({
      ...state,
      currentRoom,
      othersBoards: {},
    }),
    setGameState: (state, { payload: gameState }) => ({ ...state, ...gameState }),
    addOtherBoard: (state, { payload: { id, board } }) => {
      const { othersBoards } = state;
      return ({ ...state, othersBoards: { ...othersBoards, [id]: board } });
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
  setCurrentRoom,
  setGameState,
  setCurrentPiece,
  addOtherBoard,
} = redTetrisSlice.actions;
export default redTetrisSlice.reducer;
