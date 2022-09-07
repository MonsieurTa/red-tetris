import crypto from 'crypto';
import Piece, { rotate } from './Piece';
import Board from './Board';

import INPUTS from '../../shared/constants/inputs';
import EVENTS from '../../shared/constants/socket-io';

class Game {
  constructor({
    pieceGenerator,
    room,
    player,
  }) {
    this._room = room;
    this._player = player;
    this._board = new Board();

    this._id = crypto.randomUUID();
    this._lastTick = null;
    this._alive = false;
    this._gravity = 1; // falling block per second

    this._shapeGenerator = pieceGenerator;
    this._currentShapeIndex = -1;
    this._currentPiece = null;

    this._destroyed = false;
  }

  start() {
    this._alive = true;
    this._lastTick = Date.now();
    this._currentPiece = this._nextPiece();
  }

  stop() {
    this._alive = false;
  }

  update() {
    if (!this._alive) return;

    this._lastTick = Date.now();

    let { x, y, matrix } = this._currentPiece;
    if (this._board.canPlace(x, y + 1, matrix)) {
      this._currentPiece.move(INPUTS.DOWN);
    } else {
      this._board.lock(this._currentPiece);
      this._currentPiece = this._nextPiece();

      ({ x, y, matrix } = this._currentPiece);
      if (!this._board.canPlace(x, y, matrix)) {
        this._alive = false;
      }
    }
  }

  destroy() {
    this.stop();
    this._room = null;
    this._player = null;
    this._destroyed = true;
  }

  registerUserInputListeners() {
    const { socket } = this._player;

    const inputListener = ({ action }) => {
      if (!this._alive) return;

      let { x, y, matrix } = this._currentPiece;

      switch (action) {
        case INPUTS.ROTATE:
          const rotatedMatrix = rotate(matrix);
          if (!this._board.canPlace(x, y, rotatedMatrix)) return;

          this._currentPiece.matrix = rotatedMatrix;
          break;
        case INPUTS.LEFT:
          if (!this._board.canPlace(x - 1, y, matrix)) return;
          this._currentPiece.move(INPUTS.LEFT);
          break;
        case INPUTS.RIGHT:
          if (!this._board.canPlace(x + 1, y, matrix)) return;
          this._currentPiece.move(INPUTS.RIGHT);
          break;
        case INPUTS.HARD_DROP:
          for (let _y = y + 1; this._board.canPlace(x, _y, matrix); _y += 1) {
            this._currentPiece.move(INPUTS.DOWN);
          }
          this._board.lock(this._currentPiece);
          this._currentPiece = this._nextPiece();

          ({ x, y, matrix } = this._currentPiece);
          if (!this._board.canPlace(x, y, matrix)) {
            this._alive = false;
            return;
          }
          break;
        default:
      }
      this.emitToPlayer(EVENTS.GAME.STATE, this.toDto());
      this.emitToRoom(EVENTS.GAME.OTHERS_STATE, this.toDto());
    };
    socket.on(EVENTS.GAME.ACTION, inputListener);
  }

  toDto() {
    return {
      id: this._id,
      board: this.displayableBoard(),
    };
  }

  displayableBoard() {
    const board = this._board.copy();
    const { x, y, matrix } = this._currentPiece;

    matrix.forEach((row, _y) => {
      row.forEach((cell, _x) => {
        if (cell === '.') return;
        board[y + _y][x + _x] = this._currentPiece.shape;
      });
    });
    return board;
  }

  emitToPlayer(eventName, args) {
    this._player.socket.emit(eventName, args);
  }

  emitToRoom(eventName, args) {
    this._player.socket.to(this._room.id).emit(eventName, args);
  }

  _nextPiece() {
    this._currentShapeIndex += 1;

    const piece = new Piece(this._shapeGenerator.drawShape(this._currentShapeIndex), 0, 0);
    piece.x = parseInt((this._board.width / 2), 10) - Math.ceil(piece.width / 2);
    return piece;
  }

  get id() {
    return this._id;
  }

  get alive() {
    return this._alive;
  }

  get room() {
    return this._room;
  }

  get player() {
    return this._player;
  }

  get destroyed() {
    return this._destroyed;
  }

  get defaultDropSchedule() {
    return (Date.now() - this._lastTick) >= (1000 / this._gravity);
  }
}

export default Game;
