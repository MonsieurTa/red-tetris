import React from 'react';
import { Provider } from 'react-redux';
import { createTheme, ThemeProvider } from '@mui/material';
import { render } from '@testing-library/react';

import setupStore from '../../src/client/redux/store';

const store = setupStore();

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const AllTheProviders = ({ children }) => (
  <ThemeProvider theme={darkTheme}>
    <Provider store={store}>
      {children}
    </Provider>
  </ThemeProvider>
);

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
