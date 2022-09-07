import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card } from '@mui/material';
import EVENTS from '../../shared/constants/socket-io';

const updateBoard = (piece, board) => {
  const result = board.map((row) => row.slice());
  const { matrix, x, y } = piece;

  matrix.forEach((row, yLocal) => row.forEach((cell, xLocal) => {
    if (cell === '.') return;
    result[yLocal + y][xLocal + x] = cell;
  }));
  return result;
};

const Board = () => {
  const dispatch = useDispatch();
  const board = useSelector((store) => store.board);
  const currentRoom = useSelector((store) => store.currentRoom);

  const onClick = () => {
    if (!currentRoom) return;

    dispatch({ type: EVENTS.ROOM.READY, id: currentRoom.id });
  };
  return (
    <Card>
      {Boolean(board) && (
        <div className="flex flex-col">
          {board.map((row, i) => (
            <div key={i} className="flex flex-row gap-x-8">
              {row.map((cell, j) => <div key={j}>{cell}</div>)}
            </div>
          ))}
        </div>
      )}
      <Button
        disabled={!currentRoom}
        onClick={onClick}
      >
        Start
      </Button>
    </Card>
  );
};

export default Board;
