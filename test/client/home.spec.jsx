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

import PlayerRegistrationInput from '../../src/client/components/inputs/PlayerRegistrationInput';
import RoomCreationInput from '../../src/client/components/inputs/RoomCreationInput';
import Home from '../../src/client/pages/Home';
import Player from '../../src/server/entities/Player';
import { register } from '../../src/client/redux/reducers/red-tetris';

it('should render PlayerRegistrationInput', () => {
  const utils = render(<PlayerRegistrationInput />);
  const input = utils.getByLabelText('Choose a username');

  const submitButton = screen.getByRole('button');

  expect(submitButton).toBeDisabled();

  fireEvent.change(input, { target: { value: 'BruceWayne' } });
  expect(input.value).toBe('BruceWayne');
  expect(submitButton).not.toBeDisabled();
});

it('should render RoomCreationInput', () => {
  const utils = render(<RoomCreationInput />);
  const input = utils.getByLabelText('Create a room');

  const submitButton = screen.getByRole('button');

  expect(submitButton).toBeDisabled();

  fireEvent.change(input, { target: { value: 'NiceRoom' } });
  expect(input.value).toBe('NiceRoom');
  expect(submitButton).not.toBeDisabled();
});

it('should render without player', () => {
  const utils = render(<Home />);
  const input = utils.getByLabelText('Choose a username');

  const submitButton = screen.getByRole('button');

  expect(submitButton).toBeDisabled();

  fireEvent.change(input, { target: { value: 'BruceWayne' } });
  expect(input.value).toBe('BruceWayne');
  expect(submitButton).not.toBeDisabled();
});

it('should render with player', () => {
  store.dispatch(register(new Player('BruceWayne').toDto()));

  const utils = render(<Home />);
  const input = utils.getByLabelText('Create a room');

  const submitButton = screen.getByRole('button');

  expect(submitButton).toBeDisabled();

  fireEvent.change(input, { target: { value: 'NiceRoom' } });
  expect(input.value).toBe('NiceRoom');
  expect(submitButton).not.toBeDisabled();
});
