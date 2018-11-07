import theme from './resources/theme';

export const getDefaultTeamColor = () => {
  return theme.colors.red;
};

export const getNationalChampionshipYears = () => {
  return [1924, 1929, 1930, 1943, 1946, 1947, 1949, 1966, 1973, 1977, 1988];
};

export const getWindowDimensions = () => {
  const e = document.documentElement;
  const g = document.getElementsByTagName('body')[0];

  return {
    width: window.innerWidth || e.clientWidth || g.clientWidth,
    height: window.innerHeight || e.clientHeight || g.clientHeight,
  };
};
