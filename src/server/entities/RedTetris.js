import Room from './Room';

class RedTetris {
  constructor() {
    this._rooms = new Map();
    this._players = new Map();
  }

  register(socketId, player) {
    this._players.set(socketId, player);
  }

  findPlayer(socketId) {
    return this._players.get(socketId);
  }

  findRoom(id) {
    return this._rooms.get(id);
  }

  createRoom(id, { host, maxPlayers = 2 } = {}) {
    const game = this.findRoom(id);

    if (game) {
      return game;
    }

    const newGame = new Room({ id, maxPlayers });
    newGame.host = host;
    newGame.addPlayer(host);

    this._rooms.set(id, newGame);
    return newGame;
  }

  reset() {
    this._rooms = new Map();
  }
}

export default RedTetris;
