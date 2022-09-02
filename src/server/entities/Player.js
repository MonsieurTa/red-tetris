import crypto from 'crypto';

class Player {
  constructor(name, socketId) {
    this._id = crypto.randomUUID();
    this._socketId = socketId;
    this._name = name;
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

  get id() {
    return this._id;
  }

  set socketId(socketId) {
    this._socketId = socketId;
  }

  get socketId() {
    return this._socketId;
  }

  get name() {
    return this._name;
  }

  get alive() {
    return this._alive;
  }
}

export default Player;
