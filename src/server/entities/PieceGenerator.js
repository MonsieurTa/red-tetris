export const SEQUENCE_SIZE = 7;
export const FIRST_SEQUENCE = 'IJLT';
export const DEFAULT_SEQUENCE = 'IJLOSTZ';

export const shuffle = (array) => {
  const result = [...array];

  for (let i = 0; i < result.length; i += 1) {
    const j = parseInt((Math.random() * 100) % (i + 1), 10);
    const tmp = result[i];
    result[i] = result[j];
    result[j] = tmp;
  }
  return result;
};

const generateSequence = (isFirstSequence = false) => {
  const sequence = [];
  if (isFirstSequence) {
    sequence.push(shuffle(FIRST_SEQUENCE).pop());
  }

  const shuffledPieces = shuffle(DEFAULT_SEQUENCE);
  while (sequence.length < SEQUENCE_SIZE) {
    const piece = shuffledPieces.pop();
    if (piece !== sequence[0]) {
      sequence.push(piece);
    }
  }
  return sequence;
};

class PieceGenerator {
  constructor() {
    this._sequences = [];
  }

  reset() {
    this._sequences = [];
  }

  draw(i) {
    while (this._sequences.length <= i) {
      this._sequences.push(generateSequence(i === 0));
    }
    return this._sequences[i];
  }
}

export default PieceGenerator;
