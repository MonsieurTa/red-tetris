import RedTetris from './RedTetris';

let redTetris = null;

export const getGameSingleton = () => {
  if (!redTetris) {
    redTetris = new RedTetris();
  }

  return redTetris;
};

export { default as Room } from './Room';
