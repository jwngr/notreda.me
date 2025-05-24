import {lazy, Suspense} from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {ThemeProvider} from 'styled-components';

import theme from '../resources/theme.json';
import {ErrorScreen} from '../screens/ErrorScreen';
import {ErrorBoundary} from './ErrorBoundary';

const AsyncFootballScheduleScreen = lazy(() =>
  import('../screens/FootballScheduleScreen').then((module) => ({
    default: module.FootballScheduleScreen,
  }))
);

const AsyncExplorablesScreen = lazy(() =>
  import('../screens/ExplorablesScreen').then((module) => ({default: module.ExplorablesScreen}))
);

export const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <ErrorBoundary fallback={(error) => <ErrorScreen error={error} />}>
        <BrowserRouter>
          <Routes>
            <Route
              path="/explorables/*"
              element={
                <Suspense fallback={null}>
                  <AsyncExplorablesScreen />
                </Suspense>
              }
            />
            <Route
              path="/:selectedYear?/:selectedGameIndex?/"
              element={
                <Suspense fallback={null}>
                  <AsyncFootballScheduleScreen />
                </Suspense>
              }
            />
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </ThemeProvider>
  );
};
