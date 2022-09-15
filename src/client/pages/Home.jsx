import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  alpha,
  Card,
  CardContent,
  CardHeader,
} from '@mui/material';
import { grey } from '@mui/material/colors';

import { useNavigate } from 'react-router-dom';
import RoomCreationInput from '../components/inputs/RoomCreationInput';
import RoomInfo from '../components/RoomInfo';
import PlayerRegistrationInput from '../components/inputs/PlayerRegistrationInput';
import RoomList from '../components/RoomList';

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

  useEffect(() => {
    if (selectedRoom) {
      setSelectedRoom(rooms.find((v) => v.id === selectedRoom.id));
    }
  }, [rooms, selectedRoom]);

  return (
    <div className="flex flex-col h-full w-full gap-y-4">
      <div className="flex flex-row w-full justify-between items-cente">
        {!player ? (
          <PlayerRegistrationInput />
        ) : (
          <RoomCreationInput />
        )}
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
          <CardHeader
            title="Rooms"
            sx={{
              background: alpha(grey[900], 0.2),
            }}
          />
          <CardContent className="max-h-96 overflow-auto">
            <RoomList player={player} rooms={rooms} onSelect={(room) => setSelectedRoom(room)} />
          </CardContent>
        </Card>

        <div className="flex flex-col h-full w-full gap-y-4">
          <RoomInfo room={selectedRoom} />
        </div>
      </div>

    </div>
  );
};

export default Home;
