import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  TextField,
  Button,
} from '@mui/material';

import EVENTS from '../../shared/constants/socket-io';

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const player = useSelector((store) => store.player);
  const [username, setUsername] = useState('');

  const onClick = () => {
    dispatch({ type: EVENTS.RED_TETRIS.REGISTER, username });
  };

  useEffect(() => {
    if (!player) return;
    navigate('/rooms', { replace: true });
  }, [player, navigate]);

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

export default Home;
