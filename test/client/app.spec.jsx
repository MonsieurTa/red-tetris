/**
 * @jest-environment jsdom
 */

import React from 'react';
import {
  render,
  screen,
} from './test-utils';

import App from '../../src/client/containers/App';

it('should render App', () => {
  render(<App />);

  screen.getByRole('heading', { name: 'R E D T E T R I S' });
});
