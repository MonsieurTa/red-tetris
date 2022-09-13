/**
 * @jest-environment jsdom
 */

import reducer, {
  setSocket,
  register,
  setRooms,
  addRoom,
  removeRoom,
  setCurrentRoom,
  setGameState,
  setCurrentPiece,
  setRoomGame,
  setError,
} from '../../src/client/redux/reducers/red-tetris';

it('should return initial state', () => {
  const state = reducer(undefined, { type: undefined });
  console.log({ state });
});
