import { expect } from 'chai';
import {
  describe,
  it,
} from 'mocha';
import Piece, { rotate } from '../../src/server/entities/Piece';

describe('Piece', () => {
  it('should rotate I piece', (done) => {
    const piece = new Piece('I');
    let rotatedMatrix = rotate(piece.matrix);

    expect(rotatedMatrix).to.eql([
      ['.', '.', 'I', '.'],
      ['.', '.', 'I', '.'],
      ['.', '.', 'I', '.'],
      ['.', '.', 'I', '.'],
    ]);

    rotatedMatrix = rotate(rotatedMatrix);
    expect(rotatedMatrix).to.eql([
      ['.', '.', '.', '.'],
      ['.', '.', '.', '.'],
      ['I', 'I', 'I', 'I'],
      ['.', '.', '.', '.'],
    ]);

    rotatedMatrix = rotate(rotatedMatrix);
    expect(rotatedMatrix).to.eql([
      ['.', 'I', '.', '.'],
      ['.', 'I', '.', '.'],
      ['.', 'I', '.', '.'],
      ['.', 'I', '.', '.'],
    ]);

    done();
  });

  it('should rotate J piece', (done) => {
    const piece = new Piece('J');
    let rotatedMatrix = rotate(piece.matrix);

    expect(rotatedMatrix).to.eql([
      ['.', 'J', 'J'],
      ['.', 'J', '.'],
      ['.', 'J', '.'],
    ]);

    rotatedMatrix = rotate(rotatedMatrix);
    expect(rotatedMatrix).to.eql([
      ['.', '.', '.'],
      ['J', 'J', 'J'],
      ['.', '.', 'J'],
    ]);

    rotatedMatrix = rotate(rotatedMatrix);
    expect(rotatedMatrix).to.eql([
      ['.', 'J', '.'],
      ['.', 'J', '.'],
      ['J', 'J', '.'],
    ]);

    done();
  });

  it('should rotate L piece', (done) => {
    const piece = new Piece('L');
    let rotatedMatrix = rotate(piece.matrix);

    expect(rotatedMatrix).to.eql([
      ['.', 'L', '.'],
      ['.', 'L', '.'],
      ['.', 'L', 'L'],
    ]);

    rotatedMatrix = rotate(rotatedMatrix);
    expect(rotatedMatrix).to.eql([
      ['.', '.', '.'],
      ['L', 'L', 'L'],
      ['L', '.', '.'],
    ]);

    rotatedMatrix = rotate(rotatedMatrix);
    expect(rotatedMatrix).to.eql([
      ['L', 'L', '.'],
      ['.', 'L', '.'],
      ['.', 'L', '.'],
    ]);

    done();
  });

  it('should rotate O piece', (done) => {
    const piece = new Piece('O');
    let rotatedMatrix = rotate(piece.matrix);

    expect(rotatedMatrix).to.eql([
      ['O', 'O'],
      ['O', 'O'],
    ]);

    rotatedMatrix = rotate(rotatedMatrix);
    expect(rotatedMatrix).to.eql([
      ['O', 'O'],
      ['O', 'O'],
    ]);

    rotatedMatrix = rotate(rotatedMatrix);
    expect(rotatedMatrix).to.eql([
      ['O', 'O'],
      ['O', 'O'],
    ]);

    done();
  });

  it('should rotate S piece', (done) => {
    const piece = new Piece('S');
    let rotatedMatrix = rotate(piece.matrix);

    expect(rotatedMatrix).to.eql([
      ['.', 'S', '.'],
      ['.', 'S', 'S'],
      ['.', '.', 'S'],
    ]);

    rotatedMatrix = rotate(rotatedMatrix);
    expect(rotatedMatrix).to.eql([
      ['.', '.', '.'],
      ['.', 'S', 'S'],
      ['S', 'S', '.'],
    ]);

    rotatedMatrix = rotate(rotatedMatrix);
    expect(rotatedMatrix).to.eql([
      ['S', '.', '.'],
      ['S', 'S', '.'],
      ['.', 'S', '.'],
    ]);

    done();
  });

  it('should rotate T piece', (done) => {
    const piece = new Piece('T');
    let rotatedMatrix = rotate(piece.matrix);

    expect(rotatedMatrix).to.eql([
      ['.', 'T', '.'],
      ['.', 'T', 'T'],
      ['.', 'T', '.'],
    ]);

    rotatedMatrix = rotate(rotatedMatrix);
    expect(rotatedMatrix).to.eql([
      ['.', '.', '.'],
      ['T', 'T', 'T'],
      ['.', 'T', '.'],
    ]);

    rotatedMatrix = rotate(rotatedMatrix);
    expect(rotatedMatrix).to.eql([
      ['.', 'T', '.'],
      ['T', 'T', '.'],
      ['.', 'T', '.'],
    ]);

    done();
  });

  it('should rotate Z piece', (done) => {
    const piece = new Piece('Z');
    let rotatedMatrix = rotate(piece.matrix);

    expect(rotatedMatrix).to.eql([
      ['.', '.', 'Z'],
      ['.', 'Z', 'Z'],
      ['.', 'Z', '.'],
    ]);

    rotatedMatrix = rotate(rotatedMatrix);
    expect(rotatedMatrix).to.eql([
      ['.', '.', '.'],
      ['Z', 'Z', '.'],
      ['.', 'Z', 'Z'],
    ]);

    rotatedMatrix = rotate(rotatedMatrix);
    expect(rotatedMatrix).to.eql([
      ['.', 'Z', '.'],
      ['Z', 'Z', '.'],
      ['Z', '.', '.'],
    ]);

    done();
  });
});
