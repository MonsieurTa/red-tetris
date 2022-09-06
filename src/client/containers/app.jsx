import { Button, TextField } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { withGlobalCssPriority } from './GlobalCssPriority';

const App = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');

  const onClick = () => {
    console.log({ dispatch });
    dispatch({ type: 'red-tetris/register', name: username });
  };
  return (
    <div>
      <div className="flex flex-col w-96 gap-y-2">
        <TextField
          id="outlined-required"
          label="Type your username"
          onChange={(event) => setUsername(event.target.value)}
          value={username}
        />
        <Button
          variant="contained"
          onClick={onClick}
          disabled={!username}
        >
          Go
        </Button>
      </div>
    </div>
  );
};

export default withGlobalCssPriority(App);
