import roomActions from '../../src/server/socket-io/actions/room';

it('should return room actions', () => {
  expect(roomActions.created('NiceRoom', false)).toEqual({
    name: 'NiceRoom',
    isHost: false,
  });

  expect(roomActions.joined('NiceRoom', 'BruceWayne')).toEqual({
    name: 'NiceRoom',
    username: 'BruceWayne',
    status: 'ADDED',
  });

  expect(roomActions.ready('NiceRoom', 'Game Id')).toEqual({
    name: 'NiceRoom',
    gameId: 'Game Id',
  });
});
