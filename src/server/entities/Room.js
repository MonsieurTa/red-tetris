import crypto from 'crypto';

const MAX_PLAYERS = 2;

class Room {
  constructor({ name, host, capacity = MAX_PLAYERS }) {
    this._id = crypto.randomUUID();
    this._name = name;
    this._host = host;
    this._players = [];
    this._capacity = capacity;
  }

  addPlayer(player) {
    if (this.isFull) return;

    if (this._players.length === 0) {
      this._host = player;
    }

    this._players.push(player);
  }

  isPresent(playerId) {
    return Boolean(this._players.find(({ id }) => id === playerId));
  }

  toDto() {
    return {
      id: this._id,
      host: this._host.toDto(),
      name: this._name,
      playerCount: this.players.length,
      capacity: this._capacity,
      isFull: this.isFull,
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

  get name() {
    return this._name;
  }

  get capacity() {
    return this._capacity;
  }

  get players() {
    return this._players;
  }

  get isEmpty() {
    return this._players.length === 0;
  }

  get isFull() {
    return this._players.length >= this._capacity;
  }
}

export default Room;
