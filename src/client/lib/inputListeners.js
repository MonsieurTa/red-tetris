import INPUTS from '../../shared/constants/inputs';
import EVENTS from '../../shared/constants/socket-io';

export const inputKeyDownListener = (dispatch) => ({ code }) => {
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

export const inputKeyUpListener = (dispatch) => ({ code }) => {
  switch (code) {
    case 'ArrowDown':
      dispatch({ type: EVENTS.GAME.ACTION, action: INPUTS.DOWN, status: 'released' });
      break;
    default:
  }
};
