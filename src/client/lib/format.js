import { ERRORS } from '../../server/socket-io/actions/room';

const formatError = (error) => {
  switch (error) {
    case ERRORS.ERR_ALREADY_ADDED:
      return 'You have already joined the room.';
    case ERRORS.ERR_ALREADY_STARTED:
      return 'The room has already started.';
    case ERRORS.ERR_IS_EMPTY:
      return 'The room is empty.';
    case ERRORS.ERR_IS_FULL:
      return 'The room is full.';
    case ERRORS.ERR_NOT_FOUND:
      return 'Room not found.';
    case ERRORS.ERR_WRONG_HOST:
      return 'Wrong host.';
    default:
      return 'Unexpected error';
  }
};

export default formatError;
