import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { Box } from '@mui/material';
import EVENTS from '../../shared/constants/socket-io';
import INPUTS from '../../shared/constants/inputs';
import { WIDTH, HEIGHT } from '../../shared/helpers/board';

const CELL_SIZES = {
  md: 50,
  sm: 25,
};

const inputListener = (dispatch) => ({ code }) => {
  switch (code) {
    case 'ArrowLeft':
      dispatch({ type: EVENTS.GAME.ACTION, action: INPUTS.LEFT });
      break;
    case 'ArrowRight':
      dispatch({ type: EVENTS.GAME.ACTION, action: INPUTS.RIGHT });
      break;
    case 'ArrowUp':
      dispatch({ type: EVENTS.GAME.ACTION, action: INPUTS.ROTATE });
      break;
    case 'Space':
      dispatch({ type: EVENTS.GAME.ACTION, action: INPUTS.HARD_DROP });
      break;
    default:
  }
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
  shape,
  x,
  y,
  size = 'md',
}) => {
  const color = COLOR_MAP[shape];
  return (
    <Box sx={{
      width: CELL_SIZES[size],
      height: CELL_SIZES[size],
      borderRight: +!(x === WIDTH - 1),
      borderTop: +!(y === 0),
      borderColor: 'gray',
      backgroundColor: color,
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
        x={x}
        y={y}
      />
    ))}
  </Box>
);

const Board = ({ size = 'md', value }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    document.addEventListener('keydown', inputListener(dispatch));

    return () => {
      document.removeEventListener('keydown', inputListener(dispatch));
    };
  }, [dispatch]);

  return (
    <div>
      <Box
        className="flex flex-col"
        sx={{
          width: WIDTH * CELL_SIZES[size],
          height: HEIGHT * CELL_SIZES[size],
          backgroundColor: 'black',
        }}
      >
        {value.map((row, y) => <Row key={y} size={size} row={row} y={y} />)}
      </Box>
    </div>
  );
};

export default Board;
