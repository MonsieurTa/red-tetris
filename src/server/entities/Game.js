const MAX_PLAYERS = 2;

class Game {
  constructor({ id, maxPlayers = MAX_PLAYERS }) {
    this._id = id;
    this._host = null;
    this._players = new Set();
    this._maxPlayers = maxPlayers;
    this._running = false;
  }

  addPlayer(playerName) {
    if (this.isFull) return;

    if (this._players.size === 0) {
      this._host = playerName;
    }

    this._players.add(playerName);
  }

  isPresent(playerName) {
    return this._players.has(playerName);
  }

  get id() {
    return this._id;
  }

  set host(host) {
    this._host = host;
  }

  get host() {
    return this._host;
  }

  get isEmpty() {
    return this._players.size === 0;
  }

  get isFull() {
    return this._players.size >= this._maxPlayers;
  }

  get running() {
    return this._running;
  }
}

export default Game;
