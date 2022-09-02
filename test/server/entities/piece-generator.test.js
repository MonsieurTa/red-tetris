import { expect } from 'chai';
import {
  describe,
  it,
} from 'mocha';

import PieceGenerator, { DEFAULT_SEQUENCE, FIRST_SEQUENCE, SEQUENCE_SIZE } from '../../../src/server/entities/PieceGenerator';

describe('Piece generator', () => {
  it('should draw one sequence', (done) => {
    const generator = new PieceGenerator();

    const sequence = generator.draw(0);

    expect(sequence.length).to.equal(7);
    done();
  });

  it('should only give IJLT', (done) => {
    const expectedPieces = new Set(FIRST_SEQUENCE.split(''));
    const generator = new PieceGenerator();

    for (let i = 0; i < 1000; i += 1) {
      const sequence = generator.draw(0);
      generator.reset(0);
      expect(expectedPieces.has(sequence[0])).to.be.true;
    }
    done();
  });

  it('should draw every pieces', (done) => {
    const expectedPieces = new Set(DEFAULT_SEQUENCE.split(''));
    const generator = new PieceGenerator();

    const sequence = generator.draw(0);

    expect(expectedPieces.size).to.equal(SEQUENCE_SIZE);

    sequence.forEach((piece) => {
      expect(expectedPieces.has(piece)).to.be.true;
      expectedPieces.delete(piece);
    });

    expect(expectedPieces.size).to.equal(0);
    done();
  });
});
