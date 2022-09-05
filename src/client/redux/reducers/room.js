import { createSlice } from '@reduxjs/toolkit';

const roomSlice = createSlice({
  name: 'room',
  initialState: {},
  reducers: {
    create: (state) => state,
    join: (state) => state,
    ready: (state) => state,
  },
});

export const { create, join, ready } = roomSlice.actions;
export default roomSlice.reducer;
