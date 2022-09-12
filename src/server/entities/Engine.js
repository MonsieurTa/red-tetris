import EVENTS from '../../shared/constants/socket-io';

export const TICK_PER_SECOND = 60;

const TICK_DELAY = 1000 / TICK_PER_SECOND;

class Engine {
  constructor() {
    this._running = false;
    this._games = [];
    this._deltaTick = null;
  }

  stop() {
    this._running = false;
  }

  add(game) {
    this._games.push(game);
  }

  hasAlreadyStarted(roomId) {
    return Boolean(this._games.find((game) => game.room.id === roomId));
  }

  remove(gameId) {
    this._games = this._games.filter(({ id }) => id !== gameId);
  }

  run() {
    this._running = true;

    const loop = () => {
      const startTick = Date.now();

      this._games = this._games.filter((game) => game.alive && !game.destroyed);
      this._games.forEach((game) => {
        game.update();
        if (game.alive && game.displayable) {
          const toEmit = game.toDto();
          game.emitToPlayer(EVENTS.GAME.STATE, toEmit);
          game.emitToRoom(EVENTS.GAME.OTHERS_STATE, toEmit);
        }
      });
      const endTick = Date.now();

      this._deltaTick = endTick - startTick;
      return new Promise((resolve) => {
        setTimeout(resolve, Math.abs(TICK_DELAY - this._deltaTick));
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
