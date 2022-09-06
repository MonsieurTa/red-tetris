import * as React from 'react';
import { StyledEngineProvider } from '@mui/material/styles';

const GlobalCssPriority = ({ children }) => (
  <StyledEngineProvider injectFirst>
    {children}
  </StyledEngineProvider>
);

export const withGlobalCssPriority = (Component) => (props) => (
  <GlobalCssPriority>
    <Component {...props} />
  </GlobalCssPriority>
);

export default GlobalCssPriority;
