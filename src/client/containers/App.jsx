import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Routes,
  Route,
  Outlet,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { Container, Snackbar } from '@mui/material';

import anime from 'animejs';
import { withGlobalCssPriority } from './GlobalCssPriority';

import EVENTS from '../../shared/constants/socket-io';
import Home from '../pages/Home';
import Room from '../pages/Room';
import { setError } from '../redux/reducers/red-tetris';

import { inputKeyDownListener, inputKeyUpListener } from '../lib/inputListeners';
import formatError from '../lib/format';

const ProtectedRoute = ({ player, children, redirectPath }) => {
  if (!player) {
    return <Navigate to={redirectPath} replace />;
  }
  return children || <Outlet />;
};

const RootLayout = ({ children }) => {
  const player = useSelector((store) => store.player);
  return (
    <Container maxWidth="md" className="flex flex-col h-full items-center py-2">
      <h1 className="text-6xl my-8">
        {(player?.username ? `Hello ${player.username}` : 'RED TETRIS')
          .split('')
          .map((l, i) => <span key={i} className="inline">{l}</span>)}
      </h1>

      {children || <Outlet />}
    </Container>
  );
};

const App = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const player = useSelector((store) => store.player);
  const socket = useSelector((store) => store.socket);
  const error = useSelector((store) => store.error);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    document.addEventListener('keydown', inputKeyDownListener(dispatch));
    document.addEventListener('keyup', inputKeyUpListener(dispatch));

    return () => {
      document.removeEventListener('keydown', inputKeyDownListener(dispatch));
      document.removeEventListener('keyup', inputKeyUpListener(dispatch));
    };
  }, [dispatch]);

  useEffect(() => {
    if (!socket) return;

    const re = /^([a-zA-Z0-9_]+)\[([a-zA-Z0-9_]+)\]$/;
    const match = location.hash.replace('#', '').match(re);
    if (match) {
      const [, roomName, username] = match;
      if (!player) {
        dispatch({ type: EVENTS.RED_TETRIS.REGISTER, username });
      } else {
        dispatch({ type: EVENTS.ROOM.CREATE, playerId: player.id, name: roomName });
      }
    }
  }, [location, dispatch, socket, player]);

  useEffect(() => {
    if (error) {
      setOpenSnackbar(true);
      setError(null);
    }
  }, [error]);

  useEffect(() => {
    anime.timeline({ loop: true })
      .add({
        targets: '.text-6xl.my-8 .inline',
        scale: [4, 1],
        opacity: [0, 1],
        translateZ: 0,
        easing: 'easeOutExpo',
        duration: 950,
        delay: (el, i) => 70 * i,
      }).add({
        targets: '.text-6xl.my-8',
        opacity: 0,
        duration: 1000,
        easing: 'easeOutExpo',
        delay: 1000,
      });
  }, []);

  return (
    <div className="w-screen h-screen bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 background-animate">
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route element={<ProtectedRoute player={player} redirectPath="" />}>
            <Route path=":roomId" element={<Room />} />
          </Route>
        </Route>
        <Route path="*" exact element={<Navigate to="" replace />} />
      </Routes>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={5_000}
        onClose={() => setOpenSnackbar(false)}
        message={formatError(error)}
      />
    </div>
  );
};

export default withGlobalCssPriority(App);
