import params from '../../params';
import createServer from './index';

createServer(params.server).then(() => console.log('not yet ready to play tetris with U ...'));
