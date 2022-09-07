import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card } from '@mui/material';
import EVENTS from '../../shared/constants/socket-io';
import INPUTS from '../../shared/constants/inputs';

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
    default:
  }
};

const Board = () => {
  const dispatch = useDispatch();
  const board = useSelector((store) => store.board);
  const currentRoom = useSelector((store) => store.currentRoom);

  useEffect(() => {
    document.addEventListener('keydown', inputListener(dispatch));

    return () => {
      document.removeEventListener('keydown', inputListener(dispatch));
    };
  }, [dispatch]);

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
