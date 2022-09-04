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

    return new Promise((resolve) => {
      while (this._running) {
        this._games.forEach((game) => {
          if (!game.alive || !game.updatable) return;

          game.update();
        });
      }
      resolve();
    });
  }
}

export default Engine;
