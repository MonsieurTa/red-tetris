import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, CardContent } from '@mui/material';

import EVENTS from '../../shared/constants/socket-io';
import { WIDTH, HEIGHT, initBoard } from '../../shared/helpers/board';
import Board from '../components/Board';

const EMPTY_BOARD = initBoard(WIDTH, HEIGHT);

const Room = () => {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const currentPlayer = useSelector((store) => store.player);
  const currentRoom = useSelector((store) => {
    if (!store.currentRoom) {
      return store.rooms.find(({ id }) => id === params.roomId);
    }
    return store.currentRoom;
  });
  const board = useSelector((store) => store.board);
  const roomGames = useSelector((store) => [...Object.values(store.roomGames)]);

  useEffect(() => {
    if (!currentRoom) {
      navigate('/', { replace: true });
    } else {
      dispatch({ type: EVENTS.ROOM.JOIN, id: currentRoom.id });
    }
  }, [navigate, dispatch, currentRoom]);

  if (!currentRoom) return null;

  const { id: roomId, host, players } = currentRoom;
  const otherPlayers = players.filter((player) => player.id !== currentPlayer.id);
  const isHost = currentPlayer.id === host.id;

  const onStart = () => {
    dispatch({ type: EVENTS.ROOM.READY, id: roomId });
  };

  const onBack = () => {
    dispatch({ type: EVENTS.ROOM.LEAVE, roomId });
    navigate('/', { replace: true });
  };

  return (
    <div className="flex w-full justify-center gap-x-4">
      <div className="flex flex-col w-full gap-y-4">
        <Card>
          <CardContent>
            Sequence
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            Score
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            Combo
          </CardContent>
        </Card>

        {isHost && (
          <Button variant="contained" onClick={onStart}>
            Start
          </Button>
        )}
        <Button variant="contained" onClick={onBack}>
          Back
        </Button>
      </div>

      <Board value={board} />

      <div className="flex flex-row w-full">
        {roomGames.length ? (
          roomGames.map((game) => (
            <Board
              key={game.id}
              size="sm"
              value={game.board}
              username={game.player.name}
            />
          ))
        ) : (otherPlayers.map((player) => (
          <Board
            key={player.id}
            size="sm"
            value={EMPTY_BOARD}
            username={player.name}
          />
        )))}
      </div>
    </div>
  );
};

export default Room;
