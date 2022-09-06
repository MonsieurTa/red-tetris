import { createSlice } from '@reduxjs/toolkit';

const redTetrisSlice = createSlice({
  name: 'red-tetris',
  initialState: {
    playerId: null,
    username: null,
  },
  reducers: {
    register: (state, { playerId, username }) => ({ ...state, playerId, username }),
  },
});

export const { register } = redTetrisSlice.actions;
export default redTetrisSlice.reducer;
