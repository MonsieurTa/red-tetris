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
  },
  reducers: {
    register: (state, { payload: player }) => ({ ...state, player }),

    setRooms: (state, { payload: rooms }) => ({ ...state, rooms }),
    setCurrentRoom: (state, { payload: currentRoom }) => ({ ...state, currentRoom }),
    setBoard: (state, { payload: board }) => ({ ...state, board }),
    setCurrentPiece: (state, { payload: currentPiece }) => ({ ...state, currentPiece }),
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
} = redTetrisSlice.actions;
export default redTetrisSlice.reducer;
