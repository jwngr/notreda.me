import _ from 'lodash';
import React from 'react';

import {CURRENT_SEASON, LATEST_YEAR} from '../../../lib/constants';
import {getNationalChampionshipYears} from '../../../lib/utils';
import {
  MavMenuDecadeHeader,
  NavMenuDecadeWrapper,
  NavMenuDecadeYear,
  NavMenuDecadeYearsWrapper,
} from './index.styles';

export const NavMenuDecade: React.FC<{
  readonly startingYear: number;
  readonly selectedSeason: number;
  readonly onClick: () => void;
}> = ({startingYear, selectedSeason, onClick}) => {
  let yearsRange = _.rangeRight(startingYear, startingYear + 10);
  if (startingYear === 1880) {
    yearsRange = [1889, 1888, 1887];
  }

  const decadeContent = _.map(yearsRange, (year) => {
    let yearEnding = String(year % 100);
    if (yearEnding.length === 1) {
      yearEnding = '0' + yearEnding;
    }

    // Notre Dame did not field a team in 1980 or 1981.
    if (year === 1890 || year === 1891 || year > LATEST_YEAR) {
      return <p key={year} />;
    }

    return (
      <NavMenuDecadeYear
        key={year}
        to={`/${year}`}
        $isCurrentYear={year === CURRENT_SEASON}
        $isSelectedYear={year === selectedSeason}
        $isChampionshipYear={_.includes(getNationalChampionshipYears(), year)}
        onClick={onClick}
      >
        {yearEnding}
      </NavMenuDecadeYear>
    );
  });

  return (
    <NavMenuDecadeWrapper>
      <MavMenuDecadeHeader>
        <p>
          {startingYear}
          <span>s</span>
        </p>
      </MavMenuDecadeHeader>
      <NavMenuDecadeYearsWrapper>{decadeContent}</NavMenuDecadeYearsWrapper>
    </NavMenuDecadeWrapper>
  );
};