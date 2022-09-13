import { inputKeyDownListener, inputKeyUpListener } from '../../src/client/lib/inputListeners';
import INPUTS from '../../src/shared/constants/inputs';
import EVENTS from '../../src/shared/constants/socket-io';

const KEYCODE_BY_ACTION = {
  [INPUTS.LEFT]: 'ArrowLeft',
  [INPUTS.RIGHT]: 'ArrowRight',
  [INPUTS.ROTATE]: 'ArrowUp',
  [INPUTS.DOWN]: 'ArrowDown',
  [INPUTS.HARD_DROP]: 'Space',
};

it('should dispatch key down events', () => {
  const dispatch = ({ type, action }) => {
    expect(type).toEqual(EVENTS.GAME.ACTION);
    expect(KEYCODE_BY_ACTION[action]).not.toBeNull();
  };

  const listener = inputKeyDownListener(dispatch);

  listener({ code: 'ArrowLeft' });
  listener({ code: 'ArrowRight' });
  listener({ code: 'ArrowUp' });
  listener({ code: 'ArrowDown' });
  listener({ code: 'Space' });
});

it('should dispatch key up event', () => {
  const dispatch = ({ type, action }) => {
    expect(type).toEqual(EVENTS.GAME.ACTION);
    expect(action).toEqual(INPUTS.DOWN);
  };

  const listener = inputKeyUpListener(dispatch);

  listener({ code: 'ArrowDown' });
});
