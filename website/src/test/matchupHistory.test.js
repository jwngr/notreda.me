import _ from 'lodash';

import {getMatchupsAgainstTeam, getFilteredMatchupsAgainstTeam} from '../lib/matchupHistory';

const {past: pastMatchupsAgainstUsc, future: futureMatchupsAgainstUsc} = getMatchupsAgainstTeam(
  'USC'
);
const allMatchupsAgainstUsc = [...pastMatchupsAgainstUsc, ...futureMatchupsAgainstUsc];

const USC_EXPECTED_SEASONS = [
  // First five past matchups.
  [1926, [1926, 1927, 1928, 1929, 1930, 1931, 1932, 1933, 1934, 2019, 2020]],
  [1927, [1926, 1927, 1928, 1929, 1930, 1931, 1932, 1933, 1934, 2019, 2020]],
  [1928, [1926, 1927, 1928, 1929, 1930, 1931, 1932, 1933, 1934, 2019, 2020]],
  [1929, [1926, 1928, 1929, 1930, 1931, 1932, 1933, 1934, 1935, 2019, 2020]],
  [1930, [1926, 1929, 1930, 1931, 1932, 1933, 1934, 1935, 1936, 2019, 2020]],

  // Previous five past matchups.
  [2015, [1926, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020]],
  [2016, [1926, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020]],
  [2017, [1926, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020]],
  [2018, [1926, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020]],
  [2019, [1926, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020]],

  // All future matchups.
  [2020, [1926, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020]],
  [2021, [1926, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021]],
  [2022, [1926, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2022]],
  [2023, [1926, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2023]],
  [2024, [1926, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2024]],
  [2025, [1926, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2025]],
  [2026, [1926, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2026]],
];

const {past: pastMatchupsAgainstDrake, future: futureMatchupsAgainstDrake} = getMatchupsAgainstTeam(
  'DRKE'
);
const allMatchupsAgainstDrake = [...pastMatchupsAgainstDrake, ...futureMatchupsAgainstDrake];

const DRAKE_EXPECTED_SEASONS = [
  // All matchups.
  [1926, [1926, 1927, 1928, 1929, 1937]],
  [1927, [1926, 1927, 1928, 1929, 1937]],
  [1928, [1926, 1927, 1928, 1929, 1937]],
  [1929, [1926, 1928, 1929, 1930, 1937]],
  [1930, [1926, 1929, 1930, 1931, 1937]],
  [1931, [1926, 1930, 1931, 1932, 1937]],
  [1932, [1926, 1930, 1931, 1932, 1937]],
  [1937, [1926, 1930, 1931, 1932, 1937]],
];

describe('matchupHistory.getFilteredMatchupsAgainstTeam()', () => {
  test('throws given max less than 5', () => {
    expect(() => {
      getFilteredMatchupsAgainstTeam('USC', 2018, 4);
    }).toThrow('Cannot get filtered matchups');
  });

  test('throws given a season in which ND did not play the provided opponent', () => {
    expect(() => {
      getFilteredMatchupsAgainstTeam('USC', 1943);
    }).toThrow('Cannot get filtered matchups');
  });

  test('returns all matchups if no max is provided', () => {
    expect(getFilteredMatchupsAgainstTeam('USC', 2018)).toStrictEqual(allMatchupsAgainstUsc);
  });

  test('returns all matchups if max is larger than total w/ no future games [Drake]', () => {
    expect(getFilteredMatchupsAgainstTeam('DRKE', 1937, 15)).toStrictEqual(allMatchupsAgainstDrake);
  });

  test('returns all matchups if max is larger than total w/ no past games [Marshall]', () => {
    expect(
      getFilteredMatchupsAgainstTeam('MRSH', 2022, 15).map(({season}) => season)
    ).toStrictEqual([2022]);
  });

  test('returns all matchups if max is larger than total w/ past and future games [USC]', () => {
    expect(getFilteredMatchupsAgainstTeam('USC', 2017, 200)).toStrictEqual(allMatchupsAgainstUsc);
  });

  DRAKE_EXPECTED_SEASONS.forEach(([selectedSeason, expectedSeasons]) => {
    const gameIndex = _.findIndex(allMatchupsAgainstDrake, ({season}) => season === selectedSeason);
    test(`returns subset of matchups if max is smaller than total [Drake matchup #${
      gameIndex + 1
    } - ${selectedSeason}]`, () => {
      expect(
        getFilteredMatchupsAgainstTeam('DRKE', selectedSeason, 5).map(({season}) => season)
      ).toStrictEqual(expectedSeasons);
    });
  });

  USC_EXPECTED_SEASONS.forEach(([selectedSeason, expectedSeasons]) => {
    const gameIndex = _.findIndex(allMatchupsAgainstUsc, ({season}) => season === selectedSeason);
    test(`returns subset of matchups if max is smaller than total [USC matchup #${
      gameIndex + 1
    } - ${selectedSeason}]`, () => {
      expect(
        getFilteredMatchupsAgainstTeam('USC', selectedSeason, 11).map(({season}) => season)
      ).toStrictEqual(expectedSeasons);
    });
  });
});
