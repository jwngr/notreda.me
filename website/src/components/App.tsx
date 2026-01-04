import {RouterProvider} from '@tanstack/react-router';
import {ThemeProvider} from 'styled-components';

import theme from '../resources/theme.json';
import {router} from '../routes';
import {ErrorScreen} from '../screens/ErrorScreen';
import {ErrorBoundary} from './ErrorBoundary';

export const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <ErrorBoundary fallback={(error) => <ErrorScreen error={error} />}>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </ThemeProvider>
  );
};
