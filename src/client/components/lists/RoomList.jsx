import React from 'react';
import { useSelector } from 'react-redux';

import {
  Card, List, ListItemButton, ListItemText,
} from '@mui/material';

const RoomList = () => {
  const rooms = useSelector((state) => state.rooms || []);
  return (
    <Card>
      <List>
        {
      rooms.map(({ id, name }) => (
        <ListItemButton key={id}>
          <ListItemText primary={name} />
        </ListItemButton>
      ))
    }
      </List>
    </Card>
  );
};

export default RoomList;
