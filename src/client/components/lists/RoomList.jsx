import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Card, List, ListItemButton, ListItemText,
} from '@mui/material';

import EVENTS from '../../../shared/constants/socket-io';

const RoomListItem = ({ room }) => {
  const dispatch = useDispatch();

  const onClick = () => dispatch({ type: EVENTS.ROOM.JOIN, id: room.id });

  return (
    <ListItemButton onClick={onClick}>
      <ListItemText primary={room.name} secondary={`host: ${room.host.username}`} />
    </ListItemButton>
  );
};

const RoomList = () => {
  const rooms = useSelector((state) => state.rooms || []);
  return (
    <Card>
      <List>
        {rooms.map((room) => (
          <RoomListItem key={room.id} room={room} />))}
      </List>
    </Card>
  );
};

export default RoomList;
