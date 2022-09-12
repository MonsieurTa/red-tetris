import { ERRORS } from '../socket-io/actions/room';

const MAX_PLAYERS = 5;

class Room {
  constructor({ name, host, capacity = MAX_PLAYERS }) {
    this._id = name;
    this._host = host;
    this._players = [];
    this._capacity = capacity;
  }

  addPlayer(player) {
    if (this.isFull) {
      throw new Error(ERRORS.ERR_IS_FULL);
    }

    if (this.isPresent(player.id)) {
      throw new Error(ERRORS.ERR_ALREADY_ADDED);
    }

    if (this._players.length === 0) {
      this._host = player;
    }

    this._players.push(player);
  }

  remove(playerId) {
    this._players = this._players.filter(({ id }) => id !== playerId);

    if (this.isEmpty) return;

    if (this.host.id === playerId) {
      const [newHost] = this._players;
      this._host = newHost;
    }
  }

  isPresent(playerId) {
    return Boolean(this._players.find(({ id }) => id === playerId));
  }

  toDto() {
    return {
      id: this._id,
      host: this._host.toDto(),
      players: this._players.map((v) => v.toDto()),
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
