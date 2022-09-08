import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@mui/material';

import { withGlobalCssPriority } from './GlobalCssPriority';

import UsernameInput from '../components/inputs/UsernameInput';
import RoomInput from '../components/inputs/RoomInput';

import RoomList from '../components/lists/RoomList';
import Board from '../components/Board';
import EVENTS from '../../shared/constants/socket-io';
import { HEIGHT, initBoard, WIDTH } from '../../shared/helpers/board';
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
    case 'ArrowDown':
      dispatch({ type: EVENTS.GAME.ACTION, action: INPUTS.DOWN });
      break;
    case 'Space':
      dispatch({ type: EVENTS.GAME.ACTION, action: INPUTS.HARD_DROP });
      break;
    default:
  }
};

const App = () => {
  const dispatch = useDispatch();
  const currentRoom = useSelector((store) => store.currentRoom);
  const board = useSelector((store) => store.board || initBoard(WIDTH, HEIGHT));
  const gameInfo = useSelector(({
    score = 0,
    level = 1,
    totalLineCleared = 0,
  }) => ({ score, level, totalLineCleared }));

  const othersBoards = useSelector((store) => Object.entries(store.othersBoards || {}).sort());

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
    <div className="flex flex-row h-screen gap-x-2">
      <div className="flex flex-col gap-y-2 w-96">
        <UsernameInput />
        <RoomInput />
        <RoomList />
        {currentRoom?.name}
        <Button
          disabled={!currentRoom}
          onClick={onClick}
        >
          Start
        </Button>
      </div>
      <div className="flex flex-col">
        <Board value={board} />
        <div>{`score: ${gameInfo.score}`}</div>
        <div>{`totalLineCleared: ${gameInfo.totalLineCleared}`}</div>
        <div>{`level: ${gameInfo.level}`}</div>
      </div>
      <div className="flex">
        {othersBoards.map(([id, otherBoard]) => <Board key={id} value={otherBoard} size="sm" />)}
      </div>
    </div>
  );
};

export default withGlobalCssPriority(App);
