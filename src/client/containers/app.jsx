import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@mui/material';

import { withGlobalCssPriority } from './GlobalCssPriority';

import UsernameInput from '../components/inputs/UsernameInput';
import RoomInput from '../components/inputs/RoomInput';

import RoomList from '../components/lists/RoomList';
import Board from '../components/Board';
import EVENTS from '../../shared/constants/socket-io';
import { HEIGHT, initBoard, WIDTH } from '../../shared/helpers/board';

const App = () => {
  const dispatch = useDispatch();
  const currentRoom = useSelector((store) => store.currentRoom);
  const board = useSelector((store) => store.board || initBoard(WIDTH, HEIGHT));

  const othersBoards = useSelector((store) => Object.entries(store.othersBoards || {}).sort());

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
      <div className="flex">
        <Board value={board} />
      </div>
      <div className="flex">
        {othersBoards.map(([id, otherBoard]) => <Board key={id} value={otherBoard} size="sm" />)}
      </div>
    </div>
  );
};

export default withGlobalCssPriority(App);
