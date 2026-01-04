import {createRootRoute, createRoute, createRouter, Outlet} from '@tanstack/react-router';
import {lazy, Suspense} from 'react';

const rootRoute = createRootRoute({component: () => <Outlet />});

const AsyncFootballScheduleScreen = lazy(() =>
  import('./screens/FootballScheduleScreen').then((module) => ({
    default: module.FootballScheduleScreen,
  }))
);

const AsyncExplorablesScreen = lazy(() =>
  import('./screens/ExplorablesScreen').then((module) => ({default: module.ExplorablesScreen}))
);

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <Suspense fallback={null}>
      <AsyncFootballScheduleScreen />
    </Suspense>
  ),
});

const yearRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/$selectedYear',
  component: () => (
    <Suspense fallback={null}>
      <AsyncFootballScheduleScreen />
    </Suspense>
  ),
});

const yearGameRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/$selectedYear/$selectedGameIndex',
  component: () => (
    <Suspense fallback={null}>
      <AsyncFootballScheduleScreen />
    </Suspense>
  ),
});

const explorablesIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/explorables',
  component: () => (
    <Suspense fallback={null}>
      <AsyncExplorablesScreen />
    </Suspense>
  ),
});

const explorablesSlugRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/explorables/$slug',
  component: () => (
    <Suspense fallback={null}>
      <AsyncExplorablesScreen />
    </Suspense>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  yearRoute,
  yearGameRoute,
  explorablesIndexRoute,
  explorablesSlugRoute,
]);

export const router = createRouter({routeTree});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
