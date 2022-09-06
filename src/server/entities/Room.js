import crypto from 'crypto';

const MAX_PLAYERS = 2;

class Room {
  constructor({ name, host, maxPlayers = MAX_PLAYERS }) {
    this._id = crypto.randomUUID();
    this._name = name;
    this._host = host;
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

  toDto() {
    return {
      id: this._id,
      host: this._host,
      name: this._name,
      maxPlayers: this._maxPlayers,
    };
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

  get maxPlayers() {
    return this._maxPlayers;
  }

  get playerIds() {
    return [...this._playerIds.values()];
  }

  get isEmpty() {
    return this._playerIds.size === 0;
  }

  get isFull() {
    return this._playerIds.size >= this._maxPlayers;
  }
}

export default Room;
