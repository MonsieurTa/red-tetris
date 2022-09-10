import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  TextField,
  Button,
} from '@mui/material';

import { grey } from '@mui/material/colors';
import EVENTS from '../../../shared/constants/socket-io';

const PlayerRegistrationInput = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');

  const onClick = () => {
    dispatch({ type: EVENTS.RED_TETRIS.REGISTER, username });
  };

  return (
    <div className="flex flex-row gap-x-2">
      <TextField
        id="outlined-required"
        label="Choose a username"
        size="small"
        onChange={(event) => setUsername(event.target.value)}
        value={username}
      />

      <Button
        size="small"
        variant="contained"
        onClick={onClick}
        disabled={!username}
      >
        Create
      </Button>
    </div>
  );
};

export default PlayerRegistrationInput;
