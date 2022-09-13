import formatError from '../../src/client/lib/format';
import { ERRORS } from '../../src/server/socket-io/actions/room';

it('format error correctly', () => {
  const tests = [
    {
      input: ERRORS.ERR_ALREADY_ADDED,
      expectedOutput: 'You have already joined the room.',
    },
    {
      input: ERRORS.ERR_ALREADY_STARTED,
      expectedOutput: 'The room has already started.',
    },
    {
      input: ERRORS.ERR_IS_EMPTY,
      expectedOutput: 'The room is empty.',
    },
    {
      input: ERRORS.ERR_IS_FULL,
      expectedOutput: 'The room is full.',
    },
    {
      input: ERRORS.ERR_NOT_FOUND,
      expectedOutput: 'Room not found.',
    },
    {
      input: ERRORS.ERR_WRONG_HOST,
      expectedOutput: 'Wrong host.',
    },
    {
      input: undefined,
      expectedOutput: 'Unexpected error',
    },
  ];

  tests.forEach(({ input, expectedOutput }) => {
    expect(formatError(input)).toEqual(expectedOutput);
  });
});
