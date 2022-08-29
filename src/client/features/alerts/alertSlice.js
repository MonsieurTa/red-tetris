import { createSlice } from '@reduxjs/toolkit'

const alertSlice = createSlice({
  name: 'alert',
  initialState: {},
  reducers: {
    pop(state, action) {
      state.message = action.message
    },
  },
})

export const { pop } = alertSlice.actions
export default alertSlice.reducer

