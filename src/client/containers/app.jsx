import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Routes,
  Route,
  Outlet,
  Navigate,
} from 'react-router-dom';
import { Container } from '@mui/material';

import { withGlobalCssPriority } from './GlobalCssPriority';

import EVENTS from '../../shared/constants/socket-io';
import INPUTS from '../../shared/constants/inputs';
import Home from '../pages/Home';
import Room from '../pages/Room';

const inputKeyDownListener = (dispatch) => ({ code }) => {
  switch (code) {
    case 'ArrowLeft':
      dispatch({ type: EVENTS.GAME.ACTION, action: INPUTS.LEFT });
      break;
    case 'ArrowRight':
      dispatch({ type: EVENTS.GAME.ACTION, action: INPUTS.RIGHT });
      break;
    case 'ArrowUp':
      dispatch({ type: EVENTS.GAME.ACTION, action: INPUTS.ROTATE });
      break;
    case 'ArrowDown':
      dispatch({ type: EVENTS.GAME.ACTION, action: INPUTS.DOWN, status: 'pressed' });
      break;
    case 'Space':
      dispatch({ type: EVENTS.GAME.ACTION, action: INPUTS.HARD_DROP });
      break;
    default:
  }
};

const inputKeyUpListener = (dispatch) => ({ code }) => {
  switch (code) {
    case 'ArrowDown':
      dispatch({ type: EVENTS.GAME.ACTION, action: INPUTS.DOWN, status: 'released' });
      break;
    default:
  }
};

const ProtectedRoute = ({ player, children, redirectPath }) => {
  if (!player) {
    return <Navigate to={redirectPath} replace />;
  }
  return children || <Outlet />;
};

const RootLayout = ({ children }) => (
  <Container maxWidth="md" className="flex flex-col h-full items-center py-2">
    <div className="text-9xl my-4">RED TETRIS</div>
    {children || <Outlet />}
  </Container>
);

const App = () => {
  const dispatch = useDispatch();
  const player = useSelector((store) => store.player);

  useEffect(() => {
    document.addEventListener('keydown', inputKeyDownListener(dispatch));
    document.addEventListener('keyup', inputKeyUpListener(dispatch));

    return () => {
      document.removeEventListener('keydown', inputKeyDownListener(dispatch));
      document.removeEventListener('keyup', inputKeyUpListener(dispatch));
    };
  }, [dispatch]);

  return (
    <div className="w-screen h-screen">
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route element={<ProtectedRoute player={player} redirectPath="/" />}>
            <Route path=":roomId" element={<Room />} />
          </Route>
        </Route>
        <Route path="*" exact element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default withGlobalCssPriority(App);
