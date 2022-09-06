import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { CssBaseline } from '@mui/material';

import REDUX_ACTIONS from '../shared/actions/redux';

import App from './containers/app';

import setupStore from './redux/store';

import { HOST, PORT } from '../../params';
import './styles/index.css';

const store = setupStore();

const Root = () => {
  useEffect(() => {
    store.dispatch(REDUX_ACTIONS.WEBSOCKET.connect(`http://${HOST}:${PORT}`));
    return () => {
      store.dispatch(REDUX_ACTIONS.WEBSOCKET.disconnect());
    };
  }, []);

  return (
    <Provider store={store}>
      <CssBaseline />
      <App />
    </Provider>
  );
};

const root = createRoot(
  document.getElementById('root'),
);

root.render(<Root />);
