class RedTetris {
  constructor() {
    this._rooms = new Map();
    this._players = new Map();
    this._games = new Map();
    this._pieceGenerators = new Map();
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

  storeRoom(room) {
    this._rooms.set(room.id, this.findRoom(room.id) || room);
    return room;
  }

  findGame(gameId) {
    return this._games.get(gameId);
  }

  storeGame(game) {
    this._games.set(game.id, this.findGame(game.id) || game);
    return game;
  }

  storePieceGenerator(key, pieceGenerator) {
    this._pieceGenerators.set(key, pieceGenerator);
    return pieceGenerator;
  }

  reset() {
    this._rooms = new Map();
    this._players = new Map();
  }
}

export default RedTetris;
