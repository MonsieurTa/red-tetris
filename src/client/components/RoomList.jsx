import React from 'react';
import {
  alpha,
  List,
  ListSubheader,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { grey } from '@mui/material/colors';

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
  <List
    dense
    subheader={(
      <ListSubheader
        component="div"
        id="nested-list-subheader"
        sx={{
          background: alpha(grey[900], 0.2),
        }}
      >
        <div>Room list</div>
      </ListSubheader>
    )}
  >
    <RoomListItems
      disabled={!player}
      rooms={rooms}
      onSelect={onSelect}
    />
  </List>
);

export default RoomList;
