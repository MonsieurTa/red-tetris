import React from 'react';
import { createRoot } from 'react-dom/client';
import Root from './containers/Root';

import './styles/index.css';

const root = createRoot(
  document.getElementById('root'),
);

root.render(<Root />);

export default Root;
