import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Box } from '@mui/material';
import EVENTS from '../../shared/constants/socket-io';
import INPUTS from '../../shared/constants/inputs';
import { WIDTH, HEIGHT, initBoard } from '../../shared/helpers/board';

const CELL_SIZE = 50;

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

const Cell = ({ shape, x, y }) => {
  const color = COLOR_MAP[shape];
  return (
    <Box sx={{
      width: 50,
      height: 50,
      borderRight: +!(x === WIDTH - 1),
      borderTop: +!(y === 0),
      borderColor: 'gray',
      backgroundColor: color,
    }}
    />
  );
};

const Row = ({ row, y }) => (
  <Box
    className="flex flex-row"
    sx={{ width: row.length * CELL_SIZE, height: CELL_SIZE }}
  >
    {row.map((cell, x) => (
      <Cell
        key={x}
        shape={cell}
        x={x}
        y={y}
      />
    ))}
  </Box>
);

const Board = () => {
  const dispatch = useDispatch();
  const board = useSelector((store) => store.board || initBoard(WIDTH, HEIGHT));

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
          width: WIDTH * CELL_SIZE,
          height: HEIGHT * CELL_SIZE,
          backgroundColor: 'black',
        }}
      >
        {board.map((row, y) => <Row key={y} row={row} y={y} />)}
      </Box>
    </div>
  );
};

export default Board;
