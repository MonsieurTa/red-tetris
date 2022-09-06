import Engine from './Engine';

class RedTetris {
  constructor() {
    this._rooms = new Map();
    this._players = new Map();
    this._games = new Map();

    this._shapeGenerators = new Map();
    this._engine = new Engine();
  }

  register(player) {
    this._players.set(player.id, player);
  }

  findPlayer(socketId) {
    return this._players.get(socketId);
  }

  findRoom(id) {
    return this._rooms.get(id);
  }

  findAllRooms() {
    return [...this._rooms.values()];
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
    this._engine.add(game);
    return game;
  }

  storePieceGenerator(key, pieceGenerator) {
    this._shapeGenerators.set(key, pieceGenerator);
    return pieceGenerator;
  }

  reset() {
    this._engine.stop();
    this._engine = new Engine();
    this._shapeGenerators = new Map();
    this._rooms = new Map();
    this._players = new Map();
  }

  run() {
    return this._engine.run();
  }

  stop() {
    this._engine.stop();
  }
}

export default RedTetris;
