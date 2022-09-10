import React from 'react';
import { Container } from '@mui/material';
import { HEIGHT, initBoard, WIDTH } from '../../shared/helpers/board';
import Board from '../components/Board';

const DEFAULT_BOARD = initBoard(WIDTH, HEIGHT);

const StoryBook = () => (
  <Container className="py-4">
    <div className="flex flex-row gap-4">
      <div>
        <Board
          username="Best player in the world"
          value={DEFAULT_BOARD}
          score={12216}
          level={1}
          nextShapes={['Z', 'T', 'I']}
          lineCleared={0}
        />

        <Board
          username="Best player in the world"
          value={DEFAULT_BOARD}
          score={12216}
          level={1}
          nextShapes={[]}
          lineCleared={0}
        />
      </div>

      <Board
        size="sm"
        username="Second best player in the world"
        value={DEFAULT_BOARD}
        score={12216}
        level={1}
        nextShapes={[]}
        lineCleared={0}
      />
    </div>
  </Container>
);

export default StoryBook;
