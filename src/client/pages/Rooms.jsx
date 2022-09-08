import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Card,
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
    <div className="flex flex-col h-full w-full gap-y-4">
      <RoomCreationInput />

      <div className="flex flex-row h-full gap-x-4">
        <Card variant="outlined" sx={{ width: 1, height: 1 }}>
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

        <div className="flex flex-col h-full w-full gap-y-4">
          <RoomInfo room={selectedRoom} />

          {selectedRoom && (
            <div>
              Room preview
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Rooms;
