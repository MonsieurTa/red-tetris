import { createSlice } from '@reduxjs/toolkit';
import { DEFAULT_GAME_STATE, INITIAL_STATE } from '../../../shared/constants/redux';

const redTetrisSlice = createSlice({
  name: 'red-tetris',
  initialState: INITIAL_STATE.redTetris,
  reducers: {
    setSocket: (state, { payload: socket }) => ({ ...state, socket }),
    register: (state, { payload: player }) => ({ ...state, player }),
    setRooms: (state, { payload: rooms }) => ({ ...state, rooms }),
    addRoom: (state, { payload: room }) => ({
      ...state,
      rooms: [room, ...state.rooms],
    }),
    removeRoom: (state, { payload: roomId }) => ({
      ...state,
      rooms: state.rooms.filter(({ id }) => id !== roomId),
    }),
    setCurrentRoom: (state, { payload: currentRoom }) => {
      if (currentRoom === null) {
        return ({
          ...state,
          currentRoom: null,
          gameState: DEFAULT_GAME_STATE,
          roomGames: {},
        });
      }

      const { players } = currentRoom;
      const playerIds = new Set(players.map((v) => v.id));

      const roomGamesEntries = Object
        .entries(state.roomGames)
        .filter(([, game]) => playerIds.has(game.player.id));
      return ({
        ...state,
        currentRoom,
        roomGames: Object.fromEntries(roomGamesEntries),
      });
    },
    setGameState: (state, { payload: gameState }) => ({ ...state, gameState }),
    setRoomGame: (state, { payload: roomGame }) => {
      const { roomGames } = state;
      return ({ ...state, roomGames: { ...roomGames, [roomGame.id]: roomGame } });
    },
    setRoomRunning: (state, { payload: roomRunning }) => ({
      ...state,
      roomRunning,
      roomGames: roomRunning ? {} : state.roomGames,
    }),
    setWinner: (state, { payload: winner }) => ({ ...state, winner }),
    setError: (state, { payload: error }) => ({ ...state, error }),
  },
});

export const {
  setSocket,
  register,
  setRooms,
  addRoom,
  removeRoom,
  setCurrentRoom,
  setGameState,
  setCurrentPiece,
  setRoomGame,
  setRoomRunning,
  setWinner,
  setError,
} = redTetrisSlice.actions;
export default redTetrisSlice.reducer;
