import path from 'path'
import fs from 'fs'
import debug from 'debug'

import { StatusCodes } from 'http-status-codes'

import http from 'http'
import { Server } from 'socket.io'

const logerror = debug('tetris:error'),
  loginfo = debug('tetris:info')

const initApp = (app, params, cb) => {
  const { host, port } = params
  const handler = (req, res) => {
    const file = req.url === '/bundle.js' ? '/../../build/bundle.js' : '/../../index.html'
    fs.readFile(path.join(__dirname, file), (err, data) => {
      if (err) {
        logerror(err)
        res.writeHead(StatusCodes.INTERNAL_SERVER_ERROR)
        return res.end('Error loading index.html')
      }
      res.writeHead(StatusCodes.OK)
      res.end(data)
    })
  }

  app.on('request', handler)

  app.listen({ host, port }, () => {
    loginfo(`tetris listen on ${params.url}`)
    cb()
  })
}

const initEngine = io => {
  io.on('connection', (socket) => {
    loginfo(`Socket connected: ${ socket.id}`)
    socket.on('action', (action) => {
      if (action.type === 'server/ping') {
        socket.emit('action', { type: 'pong' })
      }
    })
  })
}

export function create(params) {
  const promise = new Promise((resolve) => {
    const app = http.createServer()

    initApp(app, params, () => {
      const io = new Server(app)

      const stop = (cb) => {
        io.close()
        app.close(() => {
          app.unref()
        })
        loginfo('Engine stopped.')
        cb()
      }

      initEngine(io)
      resolve({ stop })
    })
  })
  return promise
}
