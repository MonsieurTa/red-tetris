export const WS_ACTIONS = {
  CONNECT: 'WS_CONNECT',
  CONNECTED: 'WS_CONNECTED',
  CONNECTING: 'WS_CONNECTNG',
  CONNECT_ERROR: 'WS_CONNECT_ERROR',
  DISCONNECT: 'WS_DISCONNECT',
  DISCONNECTED: 'WS_DISCONNECTED',
};

const connect = () => ({ type: WS_ACTIONS.CONNECT });
const connected = () => ({ type: WS_ACTIONS.CONNECTED });
const connecting = () => ({ type: WS_ACTIONS.CONNECTING });
const connectError = () => ({ type: WS_ACTIONS.CONNECT_ERROR });
const disconnect = () => ({ type: WS_ACTIONS.DISCONNECT });
const disconnected = () => ({ type: WS_ACTIONS.DISCONNECTED });

const actions = {
  connect,
  connected,
  connecting,
  connectError,
  disconnect,
  disconnected,
};

export default actions;
