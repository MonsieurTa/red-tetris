import React from 'react';

import { alpha, Box, LinearProgress } from '@mui/material';
import { blueGrey, grey } from '@mui/material/colors';
import PIECES from '../../shared/constants/pieces';
import { HEIGHT, initBoard, WIDTH } from '../../shared/helpers/board';

const CELL_SIZE = 30;
const CELL_SIZES = {
  md: CELL_SIZE,
  sm: CELL_SIZE / 3,
};

const COLOR_MAP = {
  '.': 'none',
  I: 'cyan',
  J: 'blue',
  L: 'orange',
  O: 'yellow',
  S: 'green',
  T: 'purple',
  Z: 'red',
  X: 'grey',
};

const Cell = ({
  shape: shapeProp,
  size = 'md',
}) => {
  const isGhost = shapeProp.startsWith('g');
  const shape = shapeProp.replace('g', '');

  const color = COLOR_MAP[shape];

  const getBorderColor = () => {
    if (shape !== '.') return alpha(grey[900], isGhost ? 0.2 : 0.5);
    return alpha(grey[400], 0.1);
  };
  return (
    <Box sx={{
      width: CELL_SIZES[size],
      height: CELL_SIZES[size],
      border: 1,
      borderColor: getBorderColor(),
      borderRadius: size === 'sm' ? 0.5 : 1,
      backgroundColor: color,
      opacity: 1,
      boxShadow: `0px 0px ${isGhost ? '3px 3px' : '1px 1px'} ${color}`,
    }}
    />
  );
};

const Row = ({
  row,
  size = 'md',
}) => (
  <Box
    className="flex flex-row gap-x-0.5"
    sx={{
      width: row.length * CELL_SIZES[size],
      height: CELL_SIZES[size],
    }}
  >
    {row.map((cell, x) => (
      <Cell
        key={x}
        shape={cell}
        size={size}
      />
    ))}
  </Box>
);

const Piece = ({ shape }) => {
  const matrix = PIECES[shape];
  return (
    <Box
      className="flex flex-col gap-y-0.5"
      sx={{
        borderRadius: 1,
        borderColor: 'black',
      }}
    >
      {matrix.map((row, y) => (
        <Row
          key={y}
          size="sm"
          row={row}
        />
      ))}
    </Box>
  );
};

const Stats = ({
  size,
  level = 1,
  lineCleared = 0,
  nextShapes = [],
}) => {
  const mdBoxStyle = {
    width: '150px',
    backgroundColor: alpha(blueGrey[900], 0.7),
    border: 2,
    borderRadius: 1,
    borderColor: 'black',
    paddingX: 4,
    paddingY: 2,
  };

  const contentBoxStyle = {
    width: 1,
    backgroundColor: alpha(blueGrey[800], 0.7),
    padding: 1,
    borderRadius: 2,
  };

  return (
    <Box
      sx={size === 'sm' ? null : mdBoxStyle}
      className="flex flex-col-reverse items-center justify-between gap-y-4"
    >
      <div className="flex flex-col gap-y-4">
        <Box
          sx={contentBoxStyle}
          className="flex flex-col items-center gap-y-1"
        >
          <div className="font-bold">LEVEL</div>
          <div className="font-bold">{level}</div>

          <div className="w-full">
            <LinearProgress
              variant="determinate"
              value={(lineCleared % 10) * 10}
            />
          </div>
        </Box>

        <Box
          sx={contentBoxStyle}
          className="flex flex-col items-center gap-y-1"
        >
          <div className="font-bold">CLEARED</div>
          <div className="font-bold">{lineCleared}</div>
        </Box>
      </div>

      {nextShapes.length > 0 && (
        <Box
          sx={{
            width: 1,
            backgroundColor: alpha(grey[100], 0.1),
            padding: 1,
            borderRadius: 2,
          }}
          className="flex flex-col items-center gap-y-4"
        >
          <div className="font-bold">NEXT</div>

          {nextShapes.map((shape, i) => (
            <Piece key={i} shape={shape} />
          ))}
        </Box>
      )}
    </Box>
  );
};

const Board = ({
  size = 'md',
  value = initBoard(WIDTH, HEIGHT),
  username = '',
  score = 0,
  level = 1,
  lineCleared = 0,
  nextShapes = [],
}) => (
  <Box data-testid="board" className="flex flex-col gap-y-2">
    <div className="flex flex-row gap-x-4">
      <div className="flex flex-col gap-y-1">
        <Box
          sx={{
            backgroundColor: alpha(blueGrey[900], 0.8),
            border: 2,
            borderRadius: 1,
            borderColor: 'black',
            fontWeight: 'bold',
          }}
          className="px-2 flex gap-x-4 justify-between"
        >
          <div>SCORE</div>
          <div>{score}</div>
        </Box>

        <Box
          className="flex flex-col gap-y-0.5 items-center"
          sx={{
            backgroundColor: alpha(blueGrey[900], 0.8),
            border: 2,
            borderRadius: 1,
            padding: 1,
            borderColor: 'black',
          }}
        >
          {value.map((row, y) => <Row key={y} size={size} row={row} />)}
        </Box>
      </div>

      <Stats
        size={size}
        level={level}
        lineCleared={lineCleared}
        nextShapes={nextShapes}
      />
    </div>

    <div className="text-center font-bold">{username}</div>
  </Box>
);

export default Board;
