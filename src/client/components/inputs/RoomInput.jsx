import { Button, TextField } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import EVENTS from '../../../shared/constants/socket-io';

const RoomInput = () => {
  const dispatch = useDispatch();
  const player = useSelector((store) => store.player);
  const [input, setInput] = useState('');

  const onClick = () => {
    dispatch({ type: EVENTS.ROOM.CREATE, name: input });
    setInput('');
  };

  return (
    <div className="flex flex-col gap-y-2">
      <TextField
        id="outlined-required"
        label="Create a room"
        onChange={(event) => setInput(event.target.value)}
        value={input}
        disabled={!player}
      />
      <Button
        variant="contained"
        onClick={onClick}
        disabled={!input || !player}
      >
        Create
      </Button>
    </div>
  );
};

export default RoomInput;
