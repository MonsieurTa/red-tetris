import React from 'react';
import { Provider } from 'react-redux';
import { createTheme, ThemeProvider } from '@mui/material';
import { render } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom';
import setupStore from '../../src/client/redux/store';

export const store = setupStore();

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const AllTheProviders = ({ children }) => (
  <ThemeProvider theme={darkTheme}>
    <Provider store={store}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </Provider>
  </ThemeProvider>
);

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
