import { Button, Card, CardContent } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EVENTS from '../../shared/constants/socket-io';
import { WIDTH, HEIGHT, initBoard } from '../../shared/helpers/board';
import Board from '../components/Board';

const Room = () => {
  const dispatch = useDispatch();
  const currentPlayer = useSelector((store) => store.player);
  const {
    id: roomId,
    host,
    // name,
    players,
  } = useSelector((store) => store.currentRoom);
  const board = useSelector((store) => store.board);
  const roomGames = useSelector((store) => [...Object.values(store.roomGames)]);

  const otherPlayers = players.filter((player) => player.id !== currentPlayer.id);
  const isHost = currentPlayer.id === host.id;

  const onStart = () => {
    dispatch({ type: EVENTS.ROOM.READY, id: roomId });
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
      </div>

      <Board value={board} />

      <div className="flex flex-row">
        {roomGames.length ? (
          roomGames.map((game) => (
            <Board key={game.id} size="sm" value={game.board} />
          ))
        ) : (otherPlayers.map((player) => (
          <Board key={player.id} size="sm" value={initBoard(WIDTH, HEIGHT)} />
        )))}
      </div>

      <div className="flex flex-col w-full">
        Other boards
      </div>
    </div>
  );
};

export default Room;
