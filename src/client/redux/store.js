import { combineReducers, configureStore } from '@reduxjs/toolkit';

// Create the root reducer separately so we can extract the RootState type
export const rootReducer = combineReducers({});

const setupStore = (preloadedState) => configureStore({
  reducer: rootReducer,
  preloadedState,
});

export default { setupStore };
