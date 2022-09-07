import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@mui/material';

import { withGlobalCssPriority } from './GlobalCssPriority';

import UsernameInput from '../components/inputs/UsernameInput';
import RoomInput from '../components/inputs/RoomInput';

import RoomList from '../components/lists/RoomList';
import Board from '../components/Board';
import EVENTS from '../../shared/constants/socket-io';

const App = () => {
  const dispatch = useDispatch();
  const currentRoom = useSelector((store) => store.currentRoom);

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
      </div>
      <div className="flex">
        <Board />
        <Button
          disabled={!currentRoom}
          onClick={onClick}
        >
          Start
        </Button>
      </div>
    </div>
  );
};

export default withGlobalCssPriority(App);
