import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {Link} from 'react-router-dom';

import './NavMenuDecade.css';

const nationalChampionshipYears = [
  1924,
  1929,
  1930,
  1943,
  1946,
  1947,
  1949,
  1966,
  1973,
  1977,
  1988,
];

const NavMenuDecade = ({startingYear, selectedYear, onClick}) => {
  let yearsRange = _.rangeRight(startingYear, startingYear + 10);
  if (startingYear === 1880) {
    yearsRange = [1889, 1888, 1887];
  }

  const decadeContent = _.map(yearsRange, (year) => {
    let yearEnding = String(year % 100);
    if (yearEnding.length === 1) {
      yearEnding = '0' + yearEnding;
    }

    const yearLinkClasses = classNames({
      'selected-year': year === selectedYear,
      'national-championship-year': _.includes(nationalChampionshipYears, year),
    });

    return (
      <Link className={yearLinkClasses} to={`/${year}`} key={year} onClick={onClick}>
        {yearEnding}
      </Link>
    );
  });

  return (
    <div className="nav-menu-decade-container">
      <div className="nav-menu-decade">
        <div className="nav-menu-decade-header">
          <p>
            {startingYear}
            <span>s</span>
          </p>
        </div>
        <div className="nav-menu-decade-years">{decadeContent}</div>
      </div>
    </div>
  );
};

NavMenuDecade.propTypes = {
  selectedYear: PropTypes.number.isRequired,
  startingYear: PropTypes.number.isRequired,
};

export default NavMenuDecade;
