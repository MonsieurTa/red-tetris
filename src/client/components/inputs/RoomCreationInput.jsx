import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, TextField } from '@mui/material';

import { useNavigate } from 'react-router-dom';
import EVENTS from '../../../shared/constants/socket-io';
import { setCreatedRoom, setCurrentRoom } from '../../redux/reducers/red-tetris';

const RoomCreationInput = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const createdRoom = useSelector((store) => store.createdRoom);
  const [roomName, setRoomName] = useState('');

  const onClick = () => {
    dispatch({ type: EVENTS.ROOM.CREATE, name: roomName });
    setRoomName('');
  };

  useEffect(() => {
    if (createdRoom) {
      dispatch(setCurrentRoom(createdRoom));
      dispatch(setCreatedRoom(null));
      navigate(`/${createdRoom.id}`);
    }
  }, [createdRoom, dispatch, navigate]);

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
