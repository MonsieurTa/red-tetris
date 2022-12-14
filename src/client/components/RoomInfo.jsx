import React from 'react';
import {
  alpha,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { useDispatch } from 'react-redux';
import EVENTS from '../../shared/constants/socket-io';

const RoomInfoContent = ({ room }) => {
  const dispatch = useDispatch();

  if (!room) {
    return (
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="gray" gutterBottom>
          No room selected
        </Typography>
      </CardContent>
    );
  }

  const onClick = () => {
    dispatch({ type: EVENTS.ROOM.JOIN, id: room.id });
  };

  return (
    <>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Room preview
        </Typography>

        <Typography variant="h5" component="div">
          {room.id}
        </Typography>

        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {`host: ${room.host.username}`}
        </Typography>

        <Typography>
          {`players: ${room.players.length}/${room.capacity}`}
        </Typography>
      </CardContent>

      <CardActions>
        <Button
          size="small"
          onClick={onClick}
        >
          Join
        </Button>
      </CardActions>
    </>
  );
};

const RoomInfoCard = ({ room }) => (
  <Card
    variant="outlined"
    sx={{ width: 1, background: alpha(grey[900], 0.2) }}
  >
    <RoomInfoContent room={room} />
  </Card>
);

export default RoomInfoCard;
