import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {LATEST_YEAR, CURRENT_YEAR} from '../../../lib/constants.js';

import {
  NavMenuDecadeYear,
  MavMenuDecadeHeader,
  NavMenuDecadeWrapper,
  NavMenuDecadeYearsWrapper,
} from './index.styles';

import {getNationalChampionshipYears} from '../../../utils';

const NavMenuDecade = ({startingYear, selectedYear, onClick}) => {
  let yearsRange = _.rangeRight(startingYear, startingYear + 10);
  if (startingYear === 1880) {
    yearsRange = [1889, 1888, 1887];
  } else if (startingYear === 2030) {
    yearsRange = _.range(2030, LATEST_YEAR + 1);
  }

  const decadeContent = _.map(yearsRange, (year) => {
    let yearEnding = String(year % 100);
    if (yearEnding.length === 1) {
      yearEnding = '0' + yearEnding;
    }

    const yearLinkClasses = classNames({
      'current-year': year === CURRENT_YEAR,
      'selected-year': year === selectedYear,
      'national-championship-year': _.includes(getNationalChampionshipYears(), year),
    });

    // Notre Dame did not field a team in 1980 or 1981.
    if (year === 1890 || year === 1891) {
      return <p key={year} />;
    }

    return (
      <NavMenuDecadeYear className={yearLinkClasses} href={`/${year}`} key={year} onClick={onClick}>
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

NavMenuDecade.propTypes = {
  selectedYear: PropTypes.number.isRequired,
  startingYear: PropTypes.number.isRequired,
};

export default NavMenuDecade;
