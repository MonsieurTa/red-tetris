const storeStateMiddleWare = ({ getState }) => (next) => (action) => {
  window.top.state = getState();
  return next(action);
};

export default storeStateMiddleWare;
