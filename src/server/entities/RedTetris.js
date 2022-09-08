import EVENTS from '../../shared/constants/socket-io';
import Engine from './Engine';

class RedTetris {
  constructor() {
    this._io = null;
    this._rooms = new Map();
    this._players = new Map();
    this._games = new Map();

    this._shapeGenerators = new Map();
    this._engine = new Engine();
  }

  register(player) {
    this._players.set(player.id, player);
  }

  unregister(socketId) {
    const player = this.findAllPlayers().find((v) => v.socket.id === socketId);

    if (!player) return;

    this.findAllRooms()
      .forEach((room) => {
        room.remove(player.id);
        player.socket.leave(room.id);
        if (room.isEmpty) {
          this._rooms.delete(room.id);
          this._io.local.emit(EVENTS.ROOM.REMOVED, { id: room.id });
        }
      });

    this.findAllGames()
      .filter((game) => game.player.id === player.id)
      .forEach((game) => {
        game.destroy();
        this._games.delete(game.id);
      });

    this._players.delete(player.id);
  }

  findPlayer(playerId) {
    return this._players.get(playerId);
  }

  findAllPlayers() {
    return [...this._players.values()];
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

  findAllGames() {
    return [...this._games.values()];
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

  run(debug = false) {
    if (debug === true) {
      const debugLog = () => {
        console.log(`info::players ${this._players.size}`);
        this._players.forEach((player) => {
          console.log(`\tid: username: ${player.username}`);
        });

        console.log(`info::rooms ${this._rooms.size}`);
        this._rooms.forEach((room) => {
          console.log(`\tname: ${room.name} | capacity: ${room.players.length}/${room.capacity} `);
        });

        console.log(`info::games ${this._games.size}`);
        this._games.forEach((game) => {
          console.log(`\tid ${game.id} | alive: ${game.alive} | gravity: ${game._gravity} | destroyed: ${game.destroyed}`);
        });

        console.log(`info::engine game | count: ${this._engine._games.length} | deltaTick: ${this._engine._deltaTick}`);
        console.log();
        setTimeout(debugLog, 1000);
      };
      debugLog();
    }
    return this._engine.run();
  }

  stop() {
    this._engine.stop();
  }

  set io(io) {
    this._io = io;
  }
}

export default RedTetris;
