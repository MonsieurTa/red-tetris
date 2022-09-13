import { Room } from '../../src/server/entities';
import Player from '../../src/server/entities/Player';

const createRooms = (size = 10) => {
  const defaultRoomName = 'DefaultRoomName';
  const defaultPlayerName = 'DefaultPlayerName';

  return [...Array(size)].map((_, i) => {
    const host = new Player(`${defaultPlayerName}#${i}`);
    const room = new Room({ name: `${defaultRoomName}#${i}`, host });
    room.addPlayer(host);
    return room.toDto();
  });
};

export default createRooms;
