import { combineReducers, configureStore } from '@reduxjs/toolkit'

import alertReducer from './features/alerts/alertSlice'

// Create the root reducer separately so we can extract the RootState type
const rootReducer = combineReducers({
  alert: alertReducer,
})

export const setupStore = preloadedState => configureStore({
  reducer: rootReducer,
  preloadedState,
})
