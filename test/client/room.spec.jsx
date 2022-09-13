/**
 * @jest-environment jsdom
 */

import React from 'react';
import {
  render,
  screen,
  fireEvent,
  store,
} from './test-utils';

import Player from '../../src/server/entities/Player';
import Room from '../../src/server/entities/Room';

import Board from '../../src/client/components/Board';
import RoomInfoCard from '../../src/client/components/RoomInfo';
import RoomList from '../../src/client/components/RoomList';
import RoomComponent from '../../src/client/pages/Room';

import { register, setCurrentRoom } from '../../src/client/redux/reducers/red-tetris';
import createRooms from '../helpers/entities';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn().mockReturnValue({ roomId: 'Nice Room' }),
}));

it('should render Board', () => {
  const utils = render(<Board />);

  utils.getByText('SCORE');
  utils.getByText('LEVEL');
  utils.getByText('CLEARED');
});

it('should render RoomInfo with a room', () => {
  const player = new Player('Clark Kent');
  const room = new Room({ name: 'Nice room', host: player.id });
  room.addPlayer(player);

  const utils = render(<RoomInfoCard room={room.toDto()} />);

  utils.getByText('Nice room');
  utils.getByText('host: Clark Kent');
  utils.getByText('players: 1/5');
});

it('should render RoomInfo with no room', () => {
  const utils = render(<RoomInfoCard />);

  utils.getByText('No room selected');
});

it('should render RoomList with no room', () => {
  const utils = render(<RoomList />);
  utils.getByText('No room yet...');
});

it('should render RoomList with rooms but no player', async () => {
  const rooms = createRooms();

  const utils = render(<RoomList rooms={rooms} />);
  const elements = await utils.findAllByText(/DefaultRoomName#[0-9]*/i);

  expect(elements.length).toEqual(10);

  const [clickable] = elements;

  fireEvent.click(clickable);
});

it('should render with player', () => {
  const player = new Player('Bruce Wayne');
  const room = new Room({ name: 'Nice Room', host: player });
  room.addPlayer(player);

  store.dispatch(register(player.toDto()));
  store.dispatch(setCurrentRoom(room.toDto()));

  render(<RoomComponent />);

  screen.getByRole('button', { name: 'Start' });
  screen.getByRole('button', { name: 'Back' });

  screen.getByTestId('board');
});
