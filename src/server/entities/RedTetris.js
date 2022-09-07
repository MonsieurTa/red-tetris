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

  unregister(socketId) {
    const player = this.findAllPlayers().find((v) => v.socket.id === socketId);

    if (!player) return;

    this.findAllRooms()
      .forEach((room) => {
        room.remove(player.id);
        if (room.isEmpty) {
          this._rooms.delete(room.id);
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
        console.clear();
        console.log('players:');
        console.log(`\tcount: ${this._players.size}`);

        console.log('rooms:');
        console.log(`\tcount: ${this._rooms.size}`);

        console.log('games:');
        console.log(`\tcount: ${this._games.size}`);

        console.log('engine:');
        console.log(`\tgame count: ${this._engine._games.length}`);
        this._engine._games.forEach((v, i) => {
          console.log(`\tgame#${i}`);
          console.log(`\t\tname: ${v.name}`);
          console.log(`\t\talive: ${v.alive}`);
          console.log(`\t\tdestroyed: ${v.destroyed}`);
        });

        setTimeout(debugLog, 1000);
      };
      debugLog();
    }
    return this._engine.run();
  }

  stop() {
    this._engine.stop();
  }
}

export default RedTetris;
