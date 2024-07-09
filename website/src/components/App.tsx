import {lazy, Suspense} from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {ThemeProvider} from 'styled-components';

import theme from '../resources/theme.json';

const AsyncFootballScheduleScreen = lazy(() =>
  import('../screens/FootballScheduleScreen').then((module) => ({
    default: module.FootballScheduleScreen,
  }))
);

const AsyncExplorablesScreen = lazy(() =>
  // @ts-expect-error TODO: Remove this after porting explorables to TypeScript.
  import('../screens/ExplorablesScreen').then((module) => ({
    default: module.ExplorablesScreen,
  }))
);

export const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
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
    </ThemeProvider>
  );
};
