import EVENTS from '../../shared/constants/socket-io';

export const TICK_PER_SECOND = 60;

const TICK_DELAY = 1000 / TICK_PER_SECOND;

class Engine {
  constructor({ io = null } = {}) {
    this._running = false;
    this._gamesByRoomId = new Map();
    this._io = io;
  }

  stop() {
    this._running = false;
  }

  add(game) {
    const { id: roomId } = game.room;
    const storedRoomGames = this._gamesByRoomId.get(roomId);

    if (!storedRoomGames) {
      this._gamesByRoomId.set(game.room.id, [game]);
    } else {
      storedRoomGames.push(game);
    }
  }

  hasAlreadyStarted(roomId) {
    return Boolean(this._gamesByRoomId.get(roomId)?.find((game) => game.room.id === roomId));
  }

  run() {
    this._running = true;

    const loop = () => {
      [...this._gamesByRoomId.entries()]
        .forEach(([roomId, games]) => {
          const runningGames = games.filter((game) => game.alive && !game.destroyed);

          if (runningGames.length === 0) {
            this._io.to(roomId).emit(EVENTS.GAME.END, { status: 'end' });
            this._gamesByRoomId.delete(roomId);
            return;
          }

          runningGames.forEach((game) => {
            game.update();
            if (game.alive && game.displayable) {
              const toEmit = game.toDto();
              game.emitToPlayer(EVENTS.GAME.STATE, toEmit);
              game.emitToRoom(EVENTS.GAME.OTHERS_STATE, toEmit);
            }
          });

          this._gamesByRoomId.set(roomId, runningGames);
        });
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
