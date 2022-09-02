import RedTetris from './RedTetris';

let redTetris = null;

export const getRedTetrisSingleton = () => {
  if (!redTetris) {
    redTetris = new RedTetris();
  }

  return redTetris;
};

export { default as Room } from './Room';
