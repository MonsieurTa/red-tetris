import roomActions from '../../src/server/socket-io/actions/room';

it('should return room actions', () => {
  expect(roomActions.created('Nice Room', false)).toEqual({
    name: 'Nice Room',
    isHost: false,
  });

  expect(roomActions.joined('Nice Room', 'Bruce Wayne')).toEqual({
    name: 'Nice Room',
    username: 'Bruce Wayne',
    status: 'ADDED',
  });

  expect(roomActions.ready('Nice Room', 'Game Id')).toEqual({
    name: 'Nice Room',
    gameId: 'Game Id',
  });
});
