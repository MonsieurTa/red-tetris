const MAX_PLAYERS = 2;

class Game {
  constructor(id, maxPlayers = MAX_PLAYERS) {
    this._id = id;
    this._players = new Set();
    this._maxPlayers = maxPlayers;
  }

  addPlayer(playerName) {
    this._players.add(playerName);
  }

  get id() {
    return this._id;
  }
}

export default Game;
