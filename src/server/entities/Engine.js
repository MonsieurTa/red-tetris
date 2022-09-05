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
      this._games.forEach((game) => {
        if (!game.alive || !game.defaultDropSchedule) return;

        game.update();
      });
      return new Promise((resolve) => { setTimeout(resolve, 100); })
        .then(() => (this._running ? process.nextTick(loop) : null));
    };

    return loop();
  }
}

export default Engine;
