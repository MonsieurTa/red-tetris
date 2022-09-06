import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import REDUX_ACTIONS from '../shared/actions/redux';

import App from './containers/app';

import { HOST, PORT } from '../../params';

import './styles/index.css';
import setupStore from './redux/store';

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
      <App />
    </Provider>
  );
};

const root = createRoot(
  document.getElementById('root'),
);

root.render(<Root />);
