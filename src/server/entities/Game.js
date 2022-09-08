import crypto from 'crypto';
import Piece, { rotate } from './Piece';
import Board from './Board';

import INPUTS from '../../shared/constants/inputs';
import EVENTS from '../../shared/constants/socket-io';

const LOCK_DELAY = 100;

const POINTS_PER_LINE = {
  0: 0,
  1: 100,
  2: 300,
  3: 500,
  4: 800,
};

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
    this._lockTimer = null;
    this._alive = false;
    this._gravity = 1; // falling block per second
    this._firstGround = true;
    this._floorKicked = false;

    this._score = 0;
    this._totalLineCleared = 0;
    this._level = 1;

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

    const { x, y, matrix } = this._currentPiece;
    this._lastTick = Date.now();

    if (this._board.canPlace(x, y + 1, matrix)) {
      this._currentPiece.move(INPUTS.DOWN);

      if (!this._floorKicked) {
        this._firstGround = true;
      }
    } else if (this._firstGround) {
      this._lockTimer = Date.now();
      this._firstGround = false;
    } else if (Date.now() - this._lockTimer > LOCK_DELAY) {
      this._lock();
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

      const { x, y, matrix } = this._currentPiece;

      switch (action) {
        case INPUTS.ROTATE:
          this._rotate();
          break;
        case INPUTS.LEFT:
          if (!this._board.canPlace(x - 1, y, matrix)) break;
          this._currentPiece.move(INPUTS.LEFT);
          break;
        case INPUTS.RIGHT:
          if (!this._board.canPlace(x + 1, y, matrix)) break;
          this._currentPiece.move(INPUTS.RIGHT);
          break;
        case INPUTS.DOWN:
          if (!this._board.canPlace(x, y + 1, matrix)) break;
          this._currentPiece.move(INPUTS.DOWN);
          this._score += 1;
          break;
        case INPUTS.HARD_DROP:
          this._score += this._hardDrop();
          break;
        default:
      }
      this.emitToPlayer(EVENTS.GAME.STATE, this.toDto());
      this.emitToRoom(EVENTS.GAME.OTHERS_STATE, this.toDto());
    };
    socket.on(EVENTS.GAME.ACTION, inputListener);
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

  toDto() {
    return {
      id: this._id,
      board: this.displayableBoard(),
      score: this._score,
      totalLineCleared: this._totalLineCleared,
      level: this._level,
    };
  }

  _nextPiece() {
    this._currentShapeIndex += 1;

    const piece = new Piece(this._shapeGenerator.drawShape(this._currentShapeIndex), 0, 0);
    piece.x = parseInt((this._board.width / 2), 10) - Math.ceil(piece.width / 2);
    return piece;
  }

  _rotate() {
    const { x, y, matrix } = this._currentPiece;
    const rotatedMatrix = rotate(matrix);

    if (!this._board.canPlace(x, y, rotatedMatrix)) {
      // try wall kick
      if (this._board.canPlace(x + 1, y, rotatedMatrix)) {
        this._currentPiece.x += 1;
      } else if (this._board.canPlace(x - 1, y, rotatedMatrix)) {
        this._currentPiece.x -= 1;
      } else if (this._board.canPlace(x, y - 1, rotatedMatrix)) {
        // floor kick
        this._currentPiece.y -= 1;
        this._floorKicked = true;
      } else {
        return;
      }
    }
    this._currentPiece.matrix = rotatedMatrix;
    this._lockTimer = Date.now();
  }

  _hardDrop() {
    const { x, y, matrix } = this._currentPiece;
    let cellCount = 0;

    for (let _y = y + 1; this._board.canPlace(x, _y, matrix); _y += 1) {
      this._currentPiece.move(INPUTS.DOWN);
      cellCount += 1;
    }
    this._lock();
    return cellCount;
  }

  _lock() {
    let { x, y, matrix } = this._currentPiece;

    this._board.lock(this._currentPiece);

    this._currentPiece = this._nextPiece();
    this._updateGameScore();

    ({ x, y, matrix } = this._currentPiece);
    if (!this._board.canPlace(x, y, matrix)) {
      this._alive = false;
    }
  }

  _updateGameScore() {
    const lineCleared = this._board.clearLines();
    this._totalLineCleared += lineCleared;
    this._level = parseInt(this._totalLineCleared / 10, 10) + 1;

    this._score += POINTS_PER_LINE[lineCleared] * this._level;
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
