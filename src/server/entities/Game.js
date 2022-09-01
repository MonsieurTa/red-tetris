const SEQUENCE_SIZE = 7;
const FIRST_SEQUENCE = 'IJLT';
const SEQUENCE = 'IJLOSTZ';

const generateSequence = (isFirstSequence = false) => {
  const sequence = [];

  if (isFirstSequence) {
    sequence.push(FIRST_SEQUENCE[(Math.random() * 100) % FIRST_SEQUENCE.length]);
  }

  while (sequence.length < SEQUENCE_SIZE) {
    sequence.push(SEQUENCE[(Math.random() * 100) % SEQUENCE.length]);
  }
  return sequence;
};

class Game {
  constructor() {
    this._running = false;
    this._sequences = [];
  }

  start() {
    if (this._running) return;

    this._running = true;
  }

  stop() {
    if (!this._running) return;

    this._running = false;
  }

  reset() {
    this.stop();
    this._sequences = [];
  }

  getSequence(i) {
    while (this._sequences.length < i) {
      this._sequences.push(generateSequence(i === 0));
    }
    return this._sequences[i];
  }
}

export default Game;
