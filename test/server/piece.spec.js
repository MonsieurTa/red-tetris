import Piece, { rotate } from '../../src/server/entities/Piece';

describe('Piece', () => {
  it('should rotate I piece', () => {
    const piece = new Piece('I');
    let rotatedMatrix = rotate(piece.matrix);

    expect(rotatedMatrix).toEqual([
      ['.', '.', 'I', '.'],
      ['.', '.', 'I', '.'],
      ['.', '.', 'I', '.'],
      ['.', '.', 'I', '.'],
    ]);

    rotatedMatrix = rotate(rotatedMatrix);
    expect(rotatedMatrix).toEqual([
      ['.', '.', '.', '.'],
      ['.', '.', '.', '.'],
      ['I', 'I', 'I', 'I'],
      ['.', '.', '.', '.'],
    ]);

    rotatedMatrix = rotate(rotatedMatrix);
    expect(rotatedMatrix).toEqual([
      ['.', 'I', '.', '.'],
      ['.', 'I', '.', '.'],
      ['.', 'I', '.', '.'],
      ['.', 'I', '.', '.'],
    ]);
  });

  it('should rotate J piece', () => {
    const piece = new Piece('J');
    let rotatedMatrix = rotate(piece.matrix);

    expect(rotatedMatrix).toEqual([
      ['.', 'J', 'J'],
      ['.', 'J', '.'],
      ['.', 'J', '.'],
    ]);

    rotatedMatrix = rotate(rotatedMatrix);
    expect(rotatedMatrix).toEqual([
      ['.', '.', '.'],
      ['J', 'J', 'J'],
      ['.', '.', 'J'],
    ]);

    rotatedMatrix = rotate(rotatedMatrix);
    expect(rotatedMatrix).toEqual([
      ['.', 'J', '.'],
      ['.', 'J', '.'],
      ['J', 'J', '.'],
    ]);
  });

  it('should rotate L piece', () => {
    const piece = new Piece('L');
    let rotatedMatrix = rotate(piece.matrix);

    expect(rotatedMatrix).toEqual([
      ['.', 'L', '.'],
      ['.', 'L', '.'],
      ['.', 'L', 'L'],
    ]);

    rotatedMatrix = rotate(rotatedMatrix);
    expect(rotatedMatrix).toEqual([
      ['.', '.', '.'],
      ['L', 'L', 'L'],
      ['L', '.', '.'],
    ]);

    rotatedMatrix = rotate(rotatedMatrix);
    expect(rotatedMatrix).toEqual([
      ['L', 'L', '.'],
      ['.', 'L', '.'],
      ['.', 'L', '.'],
    ]);
  });

  it('should rotate O piece', () => {
    const piece = new Piece('O');
    let rotatedMatrix = rotate(piece.matrix);

    expect(rotatedMatrix).toEqual([
      ['O', 'O'],
      ['O', 'O'],
    ]);

    rotatedMatrix = rotate(rotatedMatrix);
    expect(rotatedMatrix).toEqual([
      ['O', 'O'],
      ['O', 'O'],
    ]);

    rotatedMatrix = rotate(rotatedMatrix);
    expect(rotatedMatrix).toEqual([
      ['O', 'O'],
      ['O', 'O'],
    ]);
  });

  it('should rotate S piece', () => {
    const piece = new Piece('S');
    let rotatedMatrix = rotate(piece.matrix);

    expect(rotatedMatrix).toEqual([
      ['.', 'S', '.'],
      ['.', 'S', 'S'],
      ['.', '.', 'S'],
    ]);

    rotatedMatrix = rotate(rotatedMatrix);
    expect(rotatedMatrix).toEqual([
      ['.', '.', '.'],
      ['.', 'S', 'S'],
      ['S', 'S', '.'],
    ]);

    rotatedMatrix = rotate(rotatedMatrix);
    expect(rotatedMatrix).toEqual([
      ['S', '.', '.'],
      ['S', 'S', '.'],
      ['.', 'S', '.'],
    ]);
  });

  it('should rotate T piece', () => {
    const piece = new Piece('T');
    let rotatedMatrix = rotate(piece.matrix);

    expect(rotatedMatrix).toEqual([
      ['.', 'T', '.'],
      ['.', 'T', 'T'],
      ['.', 'T', '.'],
    ]);

    rotatedMatrix = rotate(rotatedMatrix);
    expect(rotatedMatrix).toEqual([
      ['.', '.', '.'],
      ['T', 'T', 'T'],
      ['.', 'T', '.'],
    ]);

    rotatedMatrix = rotate(rotatedMatrix);
    expect(rotatedMatrix).toEqual([
      ['.', 'T', '.'],
      ['T', 'T', '.'],
      ['.', 'T', '.'],
    ]);
  });

  it('should rotate Z piece', () => {
    const piece = new Piece('Z');
    let rotatedMatrix = rotate(piece.matrix);

    expect(rotatedMatrix).toEqual([
      ['.', '.', 'Z'],
      ['.', 'Z', 'Z'],
      ['.', 'Z', '.'],
    ]);

    rotatedMatrix = rotate(rotatedMatrix);
    expect(rotatedMatrix).toEqual([
      ['.', '.', '.'],
      ['Z', 'Z', '.'],
      ['.', 'Z', 'Z'],
    ]);

    rotatedMatrix = rotate(rotatedMatrix);
    expect(rotatedMatrix).toEqual([
      ['.', 'Z', '.'],
      ['Z', 'Z', '.'],
      ['Z', '.', '.'],
    ]);
  });
});
