const MAX_PLAYERS = 2;

class Room {
  constructor({ id, host, maxPlayers = MAX_PLAYERS }) {
    this._host = host;

    this._id = id;
    this._playerIds = new Set();
    this._maxPlayers = maxPlayers;
  }

  addPlayerId(playerId) {
    if (this.isFull) return;

    if (this._playerIds.size === 0) {
      this._host = playerId;
    }

    this._playerIds.add(playerId);
  }

  isPresent(playerId) {
    return this._playerIds.has(playerId);
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
    return this._playerIds.size === 0;
  }

  get isFull() {
    return this._playerIds.size >= this._maxPlayers;
  }
}

export default Room;
