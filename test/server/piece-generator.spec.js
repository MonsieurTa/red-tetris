import PieceGenerator, {
  DEFAULT_SEQUENCE,
  FIRST_SEQUENCE,
  SEQUENCE_SIZE,
} from '../../src/server/entities/PieceGenerator';

describe('Piece generator', () => {
  it('should draw one sequence', () => {
    const generator = new PieceGenerator();

    const sequence = generator.drawSequence(0);

    expect(sequence.length).toEqual(7);
  });

  it('should only give IJLT', () => {
    const expectedPieces = new Set(FIRST_SEQUENCE.split(''));
    const generator = new PieceGenerator();

    for (let i = 0; i < 1000; i += 1) {
      const piece = generator.drawShape(0);
      generator.reset(0);
      expect(expectedPieces.has(piece)).toBeTruthy();
    }
  });

  it('should draw every pieces', () => {
    const expectedPieces = new Set(DEFAULT_SEQUENCE.split(''));
    const generator = new PieceGenerator();

    const sequence = generator.drawSequence(0);

    expect(expectedPieces.size).toEqual(SEQUENCE_SIZE);

    sequence.forEach((piece) => {
      expect(expectedPieces.has(piece)).toBeTruthy();
      expectedPieces.delete(piece);
    });

    expect(expectedPieces.size).toEqual(0);
  });
});
