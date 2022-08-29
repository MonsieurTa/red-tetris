import { combineReducers, configureStore } from '@reduxjs/toolkit';

import alertReducer from './features/alerts/alertSlice';

// Create the root reducer separately so we can extract the RootState type
export const rootReducer = combineReducers({
  alert: alertReducer,
});

const setupStore = (preloadedState) => configureStore({
  reducer: rootReducer,
  preloadedState,
});

export default { setupStore };
