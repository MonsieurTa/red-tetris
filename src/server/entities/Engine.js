/* eslint-disable no-restricted-syntax */
import { WIDTH, HEIGHT, initBoard } from '../../shared/helpers/board';
import EVENTS from '../../shared/constants/socket-io';

export const TICK_PER_SECOND = 60;

const TICK_DELAY = 1000 / TICK_PER_SECOND;

const toSpectrum = (board) => {
  const result = initBoard(WIDTH, HEIGHT);

  for (let x = 0; x < board[0].length; x += 1) {
    for (let y = 0; y < board.length; y += 1) {
      if (board[y][x] !== '.' && !board[y][x].startsWith('g')) {
        result[y][x] = board[y][x];
        break;
      }
    }
  }
  return result;
};

class Engine {
  constructor({ io = null } = {}) {
    this._running = false;
    this._gamesByRoomId = new Map();
    this._io = io;
  }

  stop() {
    this._running = false;
  }

  addGames(roomId, games) {
    this._gamesByRoomId.set(roomId, games);
  }

  hasAlreadyStarted(roomId) {
    return Boolean(this._gamesByRoomId.get(roomId)?.find((game) => game.room.id === roomId));
  }

  run() {
    this._running = true;

    const loop = () => {
      for (const roomId of this._gamesByRoomId.keys()) {
        const runningGames = this._gamesByRoomId.get(roomId)
          .filter((game) => game.alive && !game.destroyed);

        if (runningGames.length === 1) {
          const [game] = runningGames;

          if (game.kind === 'multiplayer') {
            this._io.to(roomId)
              .emit(EVENTS.GAME.END, { winner: game.player.toDto() });
            game.destroy();
            this._gamesByRoomId.delete(roomId);
            continue;
          }
        }

        if (runningGames.length === 0) {
          this._io.to(roomId).emit(EVENTS.GAME.END);
          this._gamesByRoomId.delete(roomId);
          continue;
        }

        const linesSentByGameId = new Map();
        const linesToAddByGameId = new Map();

        runningGames.forEach((game) => {
          game.update();

          linesToAddByGameId.set(game.id, 0);
          if (game.sentLines > 0) {
            linesSentByGameId.set(game.id, game.sentLines);
          }

          game.resetSentLines();
        });

        for (const senderGameId of linesSentByGameId.keys()) {
          const lineSent = linesSentByGameId.get(senderGameId);

          for (const receiverGameId of linesToAddByGameId.keys()) {
            if (senderGameId === receiverGameId) continue;
            const linesToAdd = linesToAddByGameId.get(receiverGameId);
            linesToAddByGameId.set(receiverGameId, linesToAdd + lineSent);
          }
        }

        runningGames.forEach((game) => {
          const linesToAdd = linesToAddByGameId.get(game.id);
          game.addLines(linesToAdd);

          if (game.displayable) {
            const toEmit = game.toDto();
            game.emitToPlayer(EVENTS.GAME.STATE, toEmit);

            game.emitToRoom(EVENTS.GAME.OTHERS_STATE, {
              ...toEmit,
              board: toSpectrum(game.board),
            });
          }
        });

        this._gamesByRoomId.set(roomId, runningGames);
      }

      return new Promise((resolve) => {
        setTimeout(resolve, Math.abs(TICK_DELAY));
      })
        .then(() => {
          if (!this._running) {
            return null;
          }
          return process.nextTick(loop);
        });
    };

    return loop();
  }
}

export default Engine;
