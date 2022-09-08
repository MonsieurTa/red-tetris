import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Card,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader,
} from '@mui/material';

import RoomCreationInput from '../components/inputs/RoomCreationInput';
import RoomInfo from '../components/RoomInfo';

const RoomListItems = ({ rooms, onSelect }) => {
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
      onClick={() => onSelect(room)}
    >
      <ListItemText primary={room.name} />
    </ListItemButton>
  ));
};

const Rooms = () => {
  const rooms = useSelector((store) => store.rooms);
  const [selectedRoom, setSelectedRoom] = useState(null);

  return (
    <div className="flex flex-col h-full gap-y-2">
      <RoomCreationInput />

      <Grid container spacing={0} className="h-full">
        <Grid item xs={6} className="h-full pr-2">
          <Card variant="outlined">
            <List
              dense
              subheader={(
                <ListSubheader component="div" id="nested-list-subheader">
                  Room list
                </ListSubheader>
            )}
            >
              <RoomListItems
                rooms={rooms}
                onSelect={(room) => setSelectedRoom(room)}
              />
            </List>
          </Card>
        </Grid>

        <Grid
          container
          spacing={0}
          className="flex flex-row h-full pl-2"
          item
          xs={6}
        >
          <Grid item xs={12} className="h-1/2">
            <RoomInfo room={selectedRoom} />
          </Grid>

          <Grid item xs={12} className="h-1/2">
            Room preview
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Rooms;
