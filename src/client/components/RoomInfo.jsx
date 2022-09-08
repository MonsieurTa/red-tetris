import React from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from '@mui/material';

const RoomInfoContent = ({ room }) => {
  if (!room) {
    return (
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="gray" gutterBottom>
          No room selected
        </Typography>
      </CardContent>
    );
  }

  return (
    <>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Room preview
        </Typography>

        <Typography variant="h5" component="div">
          {room.name}
        </Typography>

        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {`host: ${room.host.username}`}
        </Typography>

        <Typography>
          {`players: ${room.playersCount}/${room.capacity}`}
        </Typography>

      </CardContent>

      <CardActions>
        <Button size="small">Join</Button>
      </CardActions>
    </>
  );
};

const RoomInfoCard = ({ room }) => (
  <Card
    variant="outlined"
  >
    <RoomInfoContent room={room} />
  </Card>
);

export default RoomInfoCard;
