import React from 'react';
import {
  Modal,
  Typography,
  Box,
} from '@mui/material';
import { useSelector } from 'react-redux';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const GameEndModal = ({ winner, open, onClose }) => {
  const player = useSelector((store) => store.player);
  const isWinner = player.id === winner.id;
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {isWinner ? 'Congratulation' : 'The winner is'}
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          {isWinner ? 'You won the game!' : winner.username}
        </Typography>
      </Box>
    </Modal>
  );
};

export default GameEndModal;
