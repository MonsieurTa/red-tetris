import { Button, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import EVENTS from '../../../shared/constants/socket-io';

const UsernameInput = () => {
  const dispatch = useDispatch();
  const player = useSelector((store) => store.player);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (!player) return;
    console.log({ player });
  }, [player]);

  const onClick = () => {
    dispatch({ type: EVENTS.RED_TETRIS.REGISTER, username: input });
  };

  return (
    <div className="flex flex-col gap-y-2">
      <TextField
        id="outlined-required"
        label="Type your username"
        onChange={(event) => setInput(event.target.value)}
        value={player?.username || input}
        disabled={Boolean(player)}
      />
      <Button
        variant="contained"
        onClick={onClick}
        disabled={!input || Boolean(player)}
      >
        Go
      </Button>
    </div>
  );
};

export default UsernameInput;
