import Piece, { DIRECTION } from './Piece';
import Board from './Board';

import gameActions from '../socket-io/actions/game';

const GAME_ACTIONS = {
  ROTATE: 'ROTATE',
  MOVE_LEFT: 'MOVE_LEFT',
  MOVE_RIGHT: 'MOVE_RIGHT',
  DROP: 'DROP',
  HARD_DROP: 'HARD_DROP',
};

class Game {
  constructor({
    id,
    pieceGenerator,
    room,
    player,
  }) {
    this._room = room;
    this._player = player;
    this._board = new Board();

    this._id = id;
    this._lastTick = null;
    this._alive = false;
    this._gravity = 1; // falling block per second

    this._shapeGenerator = pieceGenerator;
    this._currentShapeIndex = -1;
  }

  start() {
    this._alive = true;
    this._lastTick = Date.now();
    this._currentPiece = this._nextPiece();

    this._emit('game:board', gameActions.board(this._board.toDto()));
    this._emit('game:currentPiece', gameActions.currentPiece(this._currentPiece.toDto()));
  }

  stop() {
    this._alive = false;
  }

  update() {
    this._lastTick = Date.now();

    const droppedPiece = this._currentPiece.copy().move(DIRECTION.DOWN);
    if (this._board.canPlace(droppedPiece)) {
      this._currentPiece.move(DIRECTION.DOWN);
    } else {
      this._board.lock(this._currentPiece);
      this._currentPiece = this._nextPiece();

      this._emit('game:board', gameActions.board(this._board.toDto()));
    }
    this._emit('game:currentPiece', gameActions.currentPiece(this._currentPiece.toDto()));
  }

  registerUserInputListeners() {
    const { socket } = this._player;

    socket.on('game:action', ({ action }) => {
      const pieceCopy = this._currentPiece.copy();
      switch (action) {
        case GAME_ACTIONS.ROTATE:
          if (!this._board.canPlace(pieceCopy.rotate())) return;
          this._currentPiece.rotate();
          break;
        case GAME_ACTIONS.MOVE_LEFT:
          if (!this._board.canPlace(pieceCopy.move(DIRECTION.LEFT))) return;
          this._currentPiece.move(DIRECTION.LEFT);
          break;
        case GAME_ACTIONS.MOVE_RIGHT:
          if (!this._board.canPlace(pieceCopy.move(DIRECTION.RIGHT))) return;
          this._currentPiece.move(DIRECTION.RIGHT);
          break;
        default:
      }
    });
  }

  _emit(eventName, args) {
    this._player.socket.emit(eventName, args);
  }

  _nextPiece() {
    this._currentShapeIndex += 1;

    const piece = new Piece(this._shapeGenerator.drawShape(this._currentShapeIndex));
    piece.x = parseInt((this._board.width / 2), 10) - Math.ceil(piece.width / 2);
    return piece;
  }

  get id() {
    return this._id;
  }

  get alive() {
    return this._alive;
  }

  get defaultDropSchedule() {
    return (Date.now() - this._lastTick) >= (1000 / this._gravity);
  }
}

export default Game;
