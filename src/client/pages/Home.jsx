import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  alpha,
  Card,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Typography,
} from '@mui/material';
import { blueGrey, grey } from '@mui/material/colors';

import { useNavigate } from 'react-router-dom';
import RoomCreationInput from '../components/inputs/RoomCreationInput';
import RoomInfo from '../components/RoomInfo';
import PlayerRegistrationInput from '../components/inputs/PlayerRegistrationInput';

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
      <ListItemText primary={room.name} />
    </ListItemButton>
  ));
};

const Home = () => {
  const navigate = useNavigate();
  const rooms = useSelector((store) => store.rooms);
  const player = useSelector((store) => store.player);
  const currentRoom = useSelector((store) => store.currentRoom);
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    if (!currentRoom) return;
    navigate(currentRoom.id, { replace: true });
  }, [navigate, currentRoom]);

  return (
    <div className="flex flex-col h-full w-full gap-y-4">
      <div className="flex flex-row w-full justify-between items-cente">
        {!player ? (
          <PlayerRegistrationInput />
        ) : (
          <RoomCreationInput />
        )}

        {player && <Typography variant="body1" color="white">{`Hello ${player.username}`}</Typography>}
      </div>

      <div className="flex flex-row gap-x-4">
        <Card
          variant="outlined"
          sx={{
            width: 1,
            height: 1,
            background: alpha(grey[900], 0.2),
          }}
        >
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

export default Home;
