import { createSlice } from '@reduxjs/toolkit';

const redTetrisSlice = createSlice({
  name: 'red-tetris',
  initialState: {
    rooms: [],
    player: null,
    game: null,
    board: null,
    currentPiece: null,
  },
  reducers: {
    register: (state, { payload: player }) => ({ ...state, player }),

    setRooms: (state, { payload: rooms }) => ({ ...state, rooms }),
    join: (state) => state,
    ready: (state) => state,

    startGame: (state) => state,
    board: (state) => state,
    currentPiece: (state) => state,
  },
});

export const { register, setRooms } = redTetrisSlice.actions;
export default redTetrisSlice.reducer;
