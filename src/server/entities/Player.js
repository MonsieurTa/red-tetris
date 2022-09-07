import crypto from 'crypto';

class Player {
  constructor(username) {
    this._id = crypto.randomUUID();
    this._username = username;
    this._socket = null;
  }

  toDto() {
    return {
      id: this._id,
      username: this._username,
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
}

export default Player;
