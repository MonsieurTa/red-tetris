import { applyMiddleware } from 'redux'
import { configureStore } from '@reduxjs/toolkit'

import * as server from '../../src/server/index'

export const startServer = (params, cb) => {
  server.create(params)
    .then(server => cb(null, server))
    .catch(err => cb(err))
}

export const configureTestStore = (
  reducer,
  socket,
  initialState,
  types,
) => configureStore({
  reducer,
  preloadedState: initialState,
  middleware: [
    myMiddleware(types),
    socketIoMiddleWare(socket),
    thunkMiddleware
  ]
})

const myMiddleware = (types = {}) => {
  const fired = {}
  return ({ dispatch, getState }) => next => action => {
    const result = next(action)
    const cb = types[action.type]

    if (cb && !fired[action.type]) {
      if (!isFunction(cb)) {
        throw new Error("action's type value must be a function")
      }

      fired[action.type] = true
      cb({getState, dispatch, action})
    }
    return result
  }
}

const thunkMiddleware =
  ({ dispatch, getState }) =>
  next =>
  action => isFunction(action) ? action(dispatch, getState) : next(action)

const isFunction = arg => typeof arg === 'function'

const socketIoMiddleWare = socket => ({ dispatch, getState }) => {
  if (socket) socket.on('action', dispatch)
  return next => action => {
    if(socket && action.type && action.type.indexOf('server/') === 0) socket.emit('action', action)
    return next(action)
  }
}
