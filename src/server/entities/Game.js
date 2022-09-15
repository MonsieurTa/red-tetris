import crypto from 'crypto';
import Piece, { rotate } from './Piece';
import Board from './Board';
import { TICK_PER_SECOND } from './Engine';

import INPUTS from '../../shared/constants/inputs';
import EVENTS from '../../shared/constants/socket-io';

const LOCK_DELAY = 250;
const MAX_GRAVITY = 20 / TICK_PER_SECOND;
const DEFAULT_GRAVITY = 1 / TICK_PER_SECOND;

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
    this._gravity = DEFAULT_GRAVITY; // falling block per second
    this._firstGround = true;
    this._floorKicked = false;

    this._score = 0;
    this._totalLineCleared = 0;
    this._sentLines = 0;
    this._level = 1;
    this._combo = 0;

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

    const { x, yFloat, matrix } = this._currentPiece;
    this._lastTick = Date.now();

    const droppedY = yFloat + this._gravity;
    if (this._board.canPlace(x, Math.floor(droppedY), matrix)) {
      this._currentPiece.setY(droppedY);

      if (this._currentPiece.y !== Math.floor(yFloat)) {
        this._displayable = true;
      }

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

    const inputListener = ({ action, status }) => {
      if (!this._alive) return;

      const {
        x, y, matrix,
      } = this._currentPiece;

      switch (action) {
        case INPUTS.ROTATE:
          if (!this._rotate()) return;
          break;
        case INPUTS.LEFT:
          if (!this._board.canPlace(x - 1, y, matrix)) return;
          this._currentPiece.move(INPUTS.LEFT);
          break;
        case INPUTS.RIGHT:
          if (!this._board.canPlace(x + 1, y, matrix)) return;
          this._currentPiece.move(INPUTS.RIGHT);
          break;
        case INPUTS.DOWN:
          if (status === 'pressed') {
            this._gravity = MAX_GRAVITY;
          } else if (status === 'released') {
            this._setCurrentGravity();
          }
          break;
        case INPUTS.HARD_DROP:
          this._score += this._hardDrop();
          break;
        default:
      }

      this._displayable = true;
    };
    socket.on(EVENTS.GAME.ACTION, inputListener);
  }

  _displayableBoard() {
    const board = this._board.copy();
    const ghostPiece = this._getGhostPiece();

    if (this._board.canPlace(ghostPiece.x, ghostPiece.y, ghostPiece.matrix)) {
      ghostPiece.matrix.forEach((row, _y) => {
        row.forEach((cell, _x) => {
          if (cell === '.') return;
          board[ghostPiece.y + _y][ghostPiece.x + _x] = `g${ghostPiece.shape}`;
        });
      });
    }

    if (this._board.canPlace(
      this._currentPiece.x,
      this._currentPiece.y,
      this._currentPiece.matrix,
    )) {
      this._currentPiece.matrix.forEach((row, _y) => {
        row.forEach((cell, _x) => {
          if (cell === '.') return;
          board[this._currentPiece.y + _y][this._currentPiece.x + _x] = this._currentPiece.shape;
        });
      });
    }

    this._displayable = false;
    return board;
  }

  addLines(count = 0) {
    if (count === 0) return;

    this._board.addLines(count);

    this._currentPiece.setY(this._currentPiece.yFloat - count);
    this._displayable = true;
  }

  resetSentLines() {
    this._sentLines = 0;
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
      player: this._player.toDto(),
      board: this._displayableBoard(),
      score: this._score,
      totalLineCleared: this._totalLineCleared,
      level: this._level,
      combo: this._combo,
      nextShapes: this._nextShapes(),
      alive: this._alive,
    };
  }

  _getGhostPiece() {
    const {
      shape,
      x,
      y,
      matrix,
    } = this._currentPiece;
    let _y = y;

    while (this._board.canPlace(x, _y + 1, matrix)) {
      _y += 1;
    }
    return new Piece(shape, x, _y, matrix);
  }

  _nextPiece() {
    this._currentShapeIndex += 1;

    const piece = new Piece(this._shapeGenerator.drawShape(this._currentShapeIndex), 0, 0);
    piece.x = parseInt((this._board.width / 2), 10) - Math.ceil(piece.width / 2);
    return piece;
  }

  _nextShapes() {
    const next = this._currentShapeIndex + 1;
    return [...Array(3)].map((_, i) => this._shapeGenerator.drawShape(next + i));
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
        this._currentPiece.setY(y - 1);
        this._floorKicked = true;
      } else {
        return false;
      }
    }
    this._currentPiece.matrix = rotatedMatrix;
    this._lockTimer = Date.now();
    return true;
  }

  _hardDrop() {
    const { x, y, matrix } = this._currentPiece;
    let cellCount = 0;

    for (let _y = y + 1; this._board.canPlace(x, _y, matrix); _y += 1) {
      this._currentPiece.setY(_y);
      cellCount += 1;
    }
    this._lock();
    return cellCount;
  }

  _lock() {
    let { x, y, matrix } = this._currentPiece;

    this._board.lock(this._currentPiece);
    this._displayable = true;

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
    this._setCurrentGravity();

    this._score += POINTS_PER_LINE[lineCleared] * this._level;

    if (lineCleared === 0) {
      this._combo = 0;
    } else {
      this._combo += 1;
      this._sentLines += lineCleared - 1;
    }
  }

  _setCurrentGravity() {
    this._gravity = DEFAULT_GRAVITY + (DEFAULT_GRAVITY * this._level) / 8;
  }

  get id() {
    return this._id;
  }

  get board() {
    return this._board.copy();
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

  get displayable() {
    return this._displayable;
  }

  get sentLines() {
    return this._sentLines;
  }
}

export default Game;
