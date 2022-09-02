class Game {
  constructor({ pieceGenerator }) {
    this._running = false;
    this._pieceGenerator = pieceGenerator;
  }

  start() {
    if (this._running) return;

    this._running = true;
  }

  stop() {
    if (!this._running) return;

    this._running = false;
  }

  reset() {
    this.stop();
    this._sequences = [];
  }
}

export default Game;
