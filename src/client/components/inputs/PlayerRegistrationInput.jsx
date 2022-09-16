import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  TextField,
  Button,
} from '@mui/material';

import EVENTS from '../../../shared/constants/socket-io';

const PlayerRegistrationInput = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [errorText, setErrorText] = useState('');

  const onChange = (event) => {
    const { target: { value } } = event;

    setUsername(value);
    if (value.match(/^[a-zA-Z0-9]{1,16}$/)) {
      setErrorText('');
    } else {
      setErrorText('Invalid username.');
    }
  };

  const onClick = () => {
    dispatch({ type: EVENTS.RED_TETRIS.REGISTER, username });
  };

  return (
    <div className="flex flex-row gap-x-2">
      <TextField
        id="outlined-required"
        label="Choose a username"
        size="small"
        onChange={onChange}
        value={username}
        error={!!errorText}
        helperText={errorText}
      />

      <Button
        size="small"
        variant="contained"
        onClick={onClick}
        disabled={!!errorText || !username}
      >
        Create
      </Button>
    </div>
  );
};

export default PlayerRegistrationInput;
