/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render } from './test-utils';
import PlayerRegistrationInput from '../../src/client/components/inputs/PlayerRegistrationInput';

describe('React', () => {
  it('render Home', async () => {
    render(<PlayerRegistrationInput />);
  });
});
