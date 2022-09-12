import React from 'react';
import { render } from '@testing-library/react';
import Home from '../../src/client/pages/Home';

describe('React', () => {
  it('render Home', async () => {
    render(<Home />);
  });
});
