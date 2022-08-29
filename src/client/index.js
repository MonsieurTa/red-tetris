import { configureStore, applyMiddleware } from 'redux'
import React from 'react'
import ReactDom from 'react-dom'
import createLogger from 'redux-logger'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'

import reducer from './reducers'
import App from './containers/app'
import { alert } from './actions/alert'

const initialState = {}

const store = configureStore({
  reducer,
  preloadedState: initialState,
  middleware: applyMiddleware(thunk, createLogger()),
})

ReactDom.render((
  <Provider store={store}>
    <App/>
  </Provider>
), document.getElementById('tetris'))

store.dispatch(alert('Soon, will be here a fantastic Tetris ...'))
