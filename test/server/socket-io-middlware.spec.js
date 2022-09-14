import {
  socketIoEmitterMiddleware,
  socketIoListenerMiddleware,
} from '../../src/client/redux/middlewares/socket-io';
import { WEBSOCKET } from '../../src/shared/constants/redux';
import EVENTS from '../../src/shared/constants/socket-io';

it('should register emitter callbacks', () => {
  const store = {
    dispatch: (args) => {
      expect(args).not.toBeNull();

      if (args.type === 'red-tetris/setSocket' && args.payload) {
        args.payload.close();
      }
    },
    getState: () => ({
      player: { id: 'some id' },
      socket: {
        close: () => {},
        on: (eventName, callback) => {
          expect(eventName).not.toBeNull();
          expect(callback).not.toBeNull();
        },
        emit: (eventName, args) => {
          expect(eventName).not.toBeNull();
          expect(args).not.toBeNull();
        },
      },
    }),
  };

  socketIoListenerMiddleware(store)(() => {})({ type: WEBSOCKET.CONNECT });
  socketIoListenerMiddleware(store)(() => {})({ type: WEBSOCKET.DISCONNECT });

  const payload = {
    username: 'username',
    action: 'action',
    gameId: 'gameId',
    id: 'id',
    name: 'name',
    roomId: 'roomId',
    status: 'status',
  };

  socketIoEmitterMiddleware(store)(() => {})({ type: EVENTS.RED_TETRIS.REGISTER, ...payload });
  socketIoEmitterMiddleware(store)(() => {})({ type: EVENTS.ROOM.CREATE, ...payload });
  socketIoEmitterMiddleware(store)(() => {})({ type: EVENTS.ROOM.JOIN, ...payload });
  socketIoEmitterMiddleware(store)(() => {})({ type: EVENTS.ROOM.LEAVE, ...payload });
  socketIoEmitterMiddleware(store)(() => {})({ type: EVENTS.ROOM.READY, ...payload });
  socketIoEmitterMiddleware(store)(() => {})({ type: EVENTS.GAME.START, ...payload });
  socketIoEmitterMiddleware(store)(() => {})({ type: EVENTS.GAME.ACTION, ...payload });
});
