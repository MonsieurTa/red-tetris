import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, TextField } from '@mui/material';

import EVENTS from '../../../shared/constants/socket-io';

const RoomCreationInput = () => {
  const dispatch = useDispatch();
  const [roomName, setRoomName] = useState('');
  const [errorText, setErrorText] = useState('');

  const onChange = (event) => {
    const { target: { value } } = event;

    setRoomName(value);
    if (value.match(/^[a-zA-Z0-9]{1,16}$/)) {
      setErrorText('');
    } else {
      setErrorText('Invalid room name.');
    }
  };

  const onClick = () => {
    dispatch({ type: EVENTS.ROOM.CREATE, name: roomName });
    setRoomName('');
  };

  return (
    <div className="flex flex-row gap-x-2 w-fit">
      <div>
        <TextField
          id="outlined-required"
          label="Create a room"
          size="small"
          onChange={onChange}
          value={roomName}
          error={!!errorText}
          helperText={errorText}
        />
      </div>

      <div>
        <Button
          size="small"
          variant="contained"
          onClick={onClick}
          disabled={!!errorText || !roomName}
        >
          Create
        </Button>
      </div>
    </div>
  );
};

export default RoomCreationInput;
