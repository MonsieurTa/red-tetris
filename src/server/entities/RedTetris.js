import Game from './Game';

class RedTetris {
  constructor() {
    this._games = new Map();
  }

  findGame(id) {
    return this._games.get(id);
  }

  createGame(id, { host, maxPlayers = 2 } = {}) {
    const game = this.findGame(id);

    if (game) {
      return game;
    }

    const newGame = new Game({ id, maxPlayers });
    newGame.host = host;
    newGame.addPlayer(host);

    this._games.set(id, newGame);
    return newGame;
  }

  reset() {
    this._games = new Map();
  }
}

export default RedTetris;
