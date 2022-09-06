import crypto from 'crypto';

class Player {
  constructor(username) {
    this._id = crypto.randomUUID();
    this._username = username;
    this._alive = true;
    this._current_sequence = 0;
  }

  nextSequence() {
    this._current_sequence += 1;
    return this._current_sequence;
  }

  reset() {
    this._alive = true;
    this._current_sequence = 0;
  }

  kill() {
    this._alive = false;
  }

  toDto() {
    return {
      id: this._id,
      username: this._username,
      alive: this._alive,
    };
  }

  get id() {
    return this._id;
  }

  set socket(socket) {
    this._socket = socket;
  }

  get socket() {
    return this._socket;
  }

  get username() {
    return this._username;
  }

  get alive() {
    return this._alive;
  }
}

export default Player;
