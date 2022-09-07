import crypto from 'crypto';
import Piece from './Piece';
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
    this._gravity = 5; // falling block per second

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

    const droppedPiece = this._currentPiece.copy().move(INPUTS.DOWN);
    if (this._board.canPlace(droppedPiece)) {
      this._currentPiece.move(INPUTS.DOWN);
    } else {
      this._board.lock(this._currentPiece);
      this._currentPiece = this._nextPiece();

      if (!this._board.canPlace(this._currentPiece)) {
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

      const pieceCopy = this._currentPiece.copy();

      switch (action) {
        case INPUTS.ROTATE:
          if (!this._board.canPlace(pieceCopy.rotate())) return;
          this._currentPiece.rotate();
          break;
        case INPUTS.LEFT:
          if (!this._board.canPlace(pieceCopy.move(INPUTS.LEFT))) return;
          this._currentPiece.move(INPUTS.LEFT);
          break;
        case INPUTS.RIGHT:
          if (!this._board.canPlace(pieceCopy.move(INPUTS.RIGHT))) return;
          this._currentPiece.move(INPUTS.RIGHT);
          break;
        case INPUTS.HARD_DROP:
          while (this._board.canPlace(pieceCopy.move(INPUTS.DOWN))) {}

          this._board.lock(pieceCopy.move(INPUTS.UP));
          this._currentPiece = this._nextPiece();

          if (!this._board.canPlace(this._currentPiece)) {
            this._alive = false;
            return;
          }
          break;
        default:
      }
      this.emitToPlayer(EVENTS.GAME.STATE, this.toDto());
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
    this._currentPiece
      .blocksPositions()
      .forEach(([x, y]) => {
        board[y][x] = this._currentPiece.shape;
      });
    return board;
  }

  emitToPlayer(eventName, args) {
    this._player.socket.emit(eventName, args);
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
