import React from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';

const RoomListItems = ({ disabled, rooms, onSelect }) => {
  if (rooms.length === 0) {
    return (
      <ListItem>
        <ListItemText
          primary="No room yet..."
          primaryTypographyProps={{
            sx: { fontSize: 14 },
            color: 'text.secondary',
            gutterBottom: true,
          }}
        />
      </ListItem>
    );
  }

  return rooms.map((room) => (
    <ListItemButton
      key={room.id}
      disabled={disabled}
      onClick={() => onSelect(room)}
    >
      <ListItemText primary={room.id} />
    </ListItemButton>
  ));
};

const RoomList = ({ player = null, rooms = [], onSelect = () => {} }) => (
  <List dense>
    <RoomListItems
      disabled={!player}
      rooms={rooms}
      onSelect={onSelect}
    />
  </List>
);

export default RoomList;
