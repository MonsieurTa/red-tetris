import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, TextField } from '@mui/material';

import EVENTS from '../../../shared/constants/socket-io';

const RoomCreationInput = () => {
  const dispatch = useDispatch();
  const [roomName, setRoomName] = useState('');

  const onClick = () => {
    dispatch({ type: EVENTS.ROOM.CREATE, name: roomName });
    setRoomName('');
  };

  return (
    <div className="flex flex-row gap-x-2 w-fit">
      <TextField
        id="outlined-required"
        label="Create a room"
        size="small"
        onChange={(event) => setRoomName(event.target.value)}
        value={roomName}
      />

      <Button
        size="small"
        variant="contained"
        onClick={onClick}
        disabled={!roomName}
      >
        Create
      </Button>
    </div>
  );
};

export default RoomCreationInput;
