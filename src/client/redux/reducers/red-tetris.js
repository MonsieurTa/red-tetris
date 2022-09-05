import { createSlice } from '@reduxjs/toolkit';

const redTetrisSlice = createSlice({
  name: 'red-tetris',
  initialState: {},
  reducers: {
    register: (state) => state,
  },
});

export const { register } = redTetrisSlice.actions;
export default redTetrisSlice.reducer;
