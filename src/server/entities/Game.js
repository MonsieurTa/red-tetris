import Piece from './Piece';
import Board, { DIRECTION } from './Board';

import gameActions from '../socket-io/actions/game';

class Game {
  constructor({
    id,
    pieceGenerator,
    room,
    player,
    io,
  }) {
    this._io = io;
    this._room = room;
    this._player = player;
    this._board = new Board();

    this._id = id;
    this._lastTick = null;
    this._alive = false;
    this._gravity = 1; // falling block per second

    this._pieceGenerator = pieceGenerator;
    this._currentPieceIndex = -1;
  }

  start() {
    this._alive = true;
    this._lastTick = Date.now();
    this._emit('game:start', gameActions.start(this._id));
    this._emit('game:board', gameActions.board(this._board.toDto()));
  }

  stop() {
    this._alive = false;
  }

  update() {
    this._lastTick = Date.now();

    if (this._board.canMove(this._currentPiece, DIRECTION.DOWN)) {
      this._currentPiece.drop();
    } else {
      this._board.lock(this._currentPiece);
      this._currentPiece = this._nextPiece();

      this._emit('game:board', gameActions.board(this._board.toDto()));
    }
    this._emit('game:current-piece', gameActions.currentPiece(this._currentPiece.toDto()));
  }

  _emit(eventName, args) {
    this._io.to(this._player.socketId).emit(eventName, args);
  }

  _nextPiece() {
    this._currentPieceIndex += 1;
    return new Piece(this._pieceGenerator.drawPiece(this._currentPieceIndex));
  }

  get id() {
    return this._id;
  }

  get alive() {
    return this._alive;
  }

  get updatable() {
    return (Date.now() - this._lastTick) >= (1000 / this._gravity);
  }
}

export default Game;
