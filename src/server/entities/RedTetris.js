import Game from './Game';

class RedTetris {
  constructor() {
    this._games = new Map();
  }

  findOrCreateGame(id) {
    const game = this._games.get(id);

    if (game) {
      return game;
    }

    const newGame = new Game(id);
    this._games.set(id, newGame);
    return newGame;
  }
}

export default RedTetris;
