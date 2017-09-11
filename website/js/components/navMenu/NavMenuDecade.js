// Libraries
import _ from 'lodash';
import React from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';

const nationalChampionshipYears = [1924, 1929, 1930, 1943, 1946, 1947, 1949, 1966, 1973, 1977, 1988];

const NavMenuDecade = ({ startingYear, selectedYear }) => {
  let yearsRange = _.rangeRight(startingYear, startingYear + 10);
  if (startingYear === 1880) {
    yearsRange = [1889, 1888, 1887];
  }

  const yearsContent = _.map(yearsRange, (year) => {
    let yearEnding = String(year % 100);
    if (yearEnding.length === 1) {
      yearEnding = '0' + yearEnding;
    }

    const yearLinkClasses = classNames({
      'selected-year': (year === selectedYear),
      'national-championship-year': _.includes(nationalChampionshipYears, year)
    });

    return <Link className={ yearLinkClasses } to={ '/' + year } key={ year }>{ yearEnding }</Link>;
  });

  return (
    <div className='nav-menu-decade'>
      <div className='nav-menu-decade-header'>
        <svg height='25' width='63'>
          <line x1='0' y1='11' x2='50' y2='11' />
          <line x1='50' y1='0' x2='50' y2='25' />
          <line x1='60' y1='0' x2='60' y2='25' />
        </svg>
        <p>{ startingYear }s</p>
        <svg height='25' width='63'>
          <line x1='13' y1='11' x2='63' y2='11' />
          <line x1='13' y1='0' x2='13' y2='25' />
          <line x1='3' y1='0' x2='3' y2='25' />
        </svg>
      </div>
      <div className='nav-menu-decade-years'>
        { yearsContent }
      </div>
    </div>
  );
};

NavMenuDecade.propTypes = {
  selectedYear: React.PropTypes.number.isRequired,
  startingYear: React.PropTypes.number.isRequired
};

export default NavMenuDecade;
