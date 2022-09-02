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

  addRoom(room) {
    this._rooms.set(room.id, this.findRoom(room.id) || room);
    return room;
  }

  reset() {
    this._rooms = new Map();
    this._players = new Map();
  }
}

export default RedTetris;
