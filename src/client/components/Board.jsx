import React from 'react';

import { Box, Typography } from '@mui/material';
import { WIDTH, HEIGHT } from '../../shared/helpers/board';

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
};

const Cell = ({
  shape: shapeProp,
  borderRight,
  borderTop,
  size = 'md',
}) => {
  const isGhost = shapeProp.startsWith('g');
  const shape = shapeProp.replace('g', '');

  const color = COLOR_MAP[shape];
  return (
    <Box sx={{
      width: CELL_SIZES[size],
      height: CELL_SIZES[size],
      borderRight: +!borderRight,
      borderTop: +!borderTop,
      borderColor: isGhost ? color : 'gray',
      backgroundColor: color,
      opacity: isGhost ? 0.5 : 1,
    }}
    />
  );
};

const Row = ({ row, y, size = 'md' }) => (
  <Box
    className="flex flex-row"
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
        borderRight={x === row.length - 1}
        borderTop={y === 0}
      />
    ))}
  </Box>
);

const Board = ({
  size = 'md',
  value,
  username = '',
}) => (
  <div>
    <Typography>{username}</Typography>
    <Box
      className="flex flex-col"
      sx={{
        width: value[0].length * CELL_SIZES[size],
        height: value.length * CELL_SIZES[size],
        backgroundColor: 'black',
      }}
    >
      {value.map((row, y) => <Row key={y} size={size} row={row} y={y} />)}
    </Box>
  </div>
);

export default Board;
