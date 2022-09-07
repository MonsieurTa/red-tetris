import { createSlice } from '@reduxjs/toolkit';

const redTetrisSlice = createSlice({
  name: 'red-tetris',
  initialState: {
    rooms: [],
    currentRoom: null,
    player: null,
    game: null,
    board: null,
    currentPiece: null,
    othersBoards: {},
  },
  reducers: {
    register: (state, { payload: player }) => ({ ...state, player }),

    setRooms: (state, { payload: rooms }) => ({ ...state, rooms }),
    setCurrentRoom: (state, { payload: currentRoom }) => ({
      ...state,
      currentRoom,
      othersBoards: {},
    }),
    setBoard: (state, { payload: board }) => ({ ...state, board }),
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
  setCurrentRoom,
  setBoard,
  setCurrentPiece,
  addOtherBoard,
} = redTetrisSlice.actions;
export default redTetrisSlice.reducer;
