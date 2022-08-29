import chai from "chai"
import { Server } from 'socket.io'

import alertReducer from '../src/client/features/alerts/alertSlice'
import { ping } from '../src/client/actions/server'
import params from '../params'

import { startServer, configureTestStore } from './helpers/server'
import { createSlice } from "@reduxjs/toolkit"

chai.should()

describe('Fake server test', () => {
  let tetrisServer

  before(cb => startServer(params.server, (err, server) => {
    tetrisServer = server
    cb()
  }))

  after((done) => { tetrisServer.stop(done) })

  it('client should pong', (done) => {
    const initialState = {}

    const { reducer } = createSlice({ name: 'server', initialState: {} })

    const socket = new Server({ path: params.server.url })
    const store =  configureTestStore(reducer, socket, initialState, {
      'server/ping': () => done()
    })

    store.dispatch(ping())
  });
});
