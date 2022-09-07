import EVENTS from '../../shared/constants/socket-io';

class Engine {
  constructor() {
    this._running = false;
    this._games = [];
  }

  stop() {
    this._running = false;
  }

  add(game) {
    this._games.push(game);
  }

  run() {
    this._running = true;

    const loop = () => {
      this._games = this._games.filter((game) => game.alive && !game.destroyed);

      this._games.forEach((game) => {
        if (!game.defaultDropSchedule) return;

        game.update();

        if (game.alive) {
          const toEmit = game.toDto();
          game.emitToPlayer(EVENTS.GAME.STATE, toEmit);
          game.emitToRoom(EVENTS.GAME.OTHERS_STATE, toEmit);
        }
      });
      return new Promise((resolve) => { setTimeout(resolve, 100); })
        .then(() => (this._running ? process.nextTick(loop) : null));
    };

    return loop();
  }
}

export default Engine;
