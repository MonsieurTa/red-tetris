import { createSlice } from '@reduxjs/toolkit';

const gameSlice = createSlice({
  name: 'game',
  initialState: {},
  reducers: {
    start: (state) => state,
    board: (state) => state,
    currentPiece: (state) => state,
  },
});

export const { start, board, currentPiece } = gameSlice.actions;
export default gameSlice.reducer;
