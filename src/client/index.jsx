import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';

import REDUX_ACTIONS from '../shared/actions/redux';

import App from './containers/app';

import setupStore from './redux/store';

import { HOST, PORT } from '../../params';
import './styles/index.css';

const store = setupStore();

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const Root = () => {
  useEffect(() => {
    store.dispatch(REDUX_ACTIONS.WEBSOCKET.connect(`http://${HOST}:${PORT}`));
    return () => {
      store.dispatch(REDUX_ACTIONS.WEBSOCKET.disconnect());
    };
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  );
};

const root = createRoot(
  document.getElementById('root'),
);

root.render(<Root />);

export default Root;
