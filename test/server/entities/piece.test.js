import { expect } from 'chai';
import {
  describe,
  it,
} from 'mocha';
import Piece from '../../../src/server/entities/Piece';

describe('Piece', () => {
  it('should rotate I piece', (done) => {
    const piece = new Piece('I');

    expect(piece.rotate()).to.eql([
      ['.', '.', 'I', '.'],
      ['.', '.', 'I', '.'],
      ['.', '.', 'I', '.'],
      ['.', '.', 'I', '.'],
    ]);

    expect(piece.rotate()).to.eql([
      ['.', '.', '.', '.'],
      ['.', '.', '.', '.'],
      ['I', 'I', 'I', 'I'],
      ['.', '.', '.', '.'],
    ]);

    expect(piece.rotate()).to.eql([
      ['.', 'I', '.', '.'],
      ['.', 'I', '.', '.'],
      ['.', 'I', '.', '.'],
      ['.', 'I', '.', '.'],
    ]);

    done();
  });

  it('should rotate J piece', (done) => {
    const piece = new Piece('J');

    expect(piece.rotate()).to.eql([
      ['.', 'J', 'J'],
      ['.', 'J', '.'],
      ['.', 'J', '.'],
    ]);

    expect(piece.rotate()).to.eql([
      ['.', '.', '.'],
      ['J', 'J', 'J'],
      ['.', '.', 'J'],
    ]);

    expect(piece.rotate()).to.eql([
      ['.', 'J', '.'],
      ['.', 'J', '.'],
      ['J', 'J', '.'],
    ]);

    done();
  });

  it('should rotate L piece', (done) => {
    const piece = new Piece('L');

    expect(piece.rotate()).to.eql([
      ['.', 'L', '.'],
      ['.', 'L', '.'],
      ['.', 'L', 'L'],
    ]);

    expect(piece.rotate()).to.eql([
      ['.', '.', '.'],
      ['L', 'L', 'L'],
      ['L', '.', '.'],
    ]);

    expect(piece.rotate()).to.eql([
      ['L', 'L', '.'],
      ['.', 'L', '.'],
      ['.', 'L', '.'],
    ]);

    done();
  });

  it('should rotate O piece', (done) => {
    const piece = new Piece('O');

    expect(piece.rotate()).to.eql([
      ['O', 'O'],
      ['O', 'O'],
    ]);

    expect(piece.rotate()).to.eql([
      ['O', 'O'],
      ['O', 'O'],
    ]);

    expect(piece.rotate()).to.eql([
      ['O', 'O'],
      ['O', 'O'],
    ]);

    done();
  });

  it('should rotate S piece', (done) => {
    const piece = new Piece('S');

    expect(piece.rotate()).to.eql([
      ['.', 'S', '.'],
      ['.', 'S', 'S'],
      ['.', '.', 'S'],
    ]);

    expect(piece.rotate()).to.eql([
      ['.', '.', '.'],
      ['.', 'S', 'S'],
      ['S', 'S', '.'],
    ]);

    expect(piece.rotate()).to.eql([
      ['S', '.', '.'],
      ['S', 'S', '.'],
      ['.', 'S', '.'],
    ]);

    done();
  });

  it('should rotate T piece', (done) => {
    const piece = new Piece('T');

    expect(piece.rotate()).to.eql([
      ['.', 'T', '.'],
      ['.', 'T', 'T'],
      ['.', 'T', '.'],
    ]);

    expect(piece.rotate()).to.eql([
      ['.', '.', '.'],
      ['T', 'T', 'T'],
      ['.', 'T', '.'],
    ]);

    expect(piece.rotate()).to.eql([
      ['.', 'T', '.'],
      ['T', 'T', '.'],
      ['.', 'T', '.'],
    ]);

    done();
  });

  it('should rotate Z piece', (done) => {
    const piece = new Piece('Z');

    expect(piece.rotate()).to.eql([
      ['.', '.', 'Z'],
      ['.', 'Z', 'Z'],
      ['.', 'Z', '.'],
    ]);

    expect(piece.rotate()).to.eql([
      ['.', '.', '.'],
      ['Z', 'Z', '.'],
      ['.', 'Z', 'Z'],
    ]);

    expect(piece.rotate()).to.eql([
      ['.', 'Z', '.'],
      ['Z', 'Z', '.'],
      ['Z', '.', '.'],
    ]);

    done();
  });
});
