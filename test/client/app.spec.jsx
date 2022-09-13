/**
 * @jest-environment jsdom
 */

import React from 'react';
import {
  render,
  screen,
  fireEvent,
} from './test-utils';

import App from '../../src/client/containers/App';

it('should render PlayerRegistrationInput', () => {
  const utils = render(<App />);
  //   const input = utils.getByLabelText('Choose a username');

  //   const submitButton = screen.getByRole('button');

  //   expect(submitButton).toBeDisabled();

//   fireEvent.change(input, { target: { value: 'Bruce Wayne' } });
//   expect(input.value).toBe('Bruce Wayne');
//   expect(submitButton).not.toBeDisabled();
});
