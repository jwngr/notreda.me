import rangeRight from 'lodash/rangeRight';
import {darken} from 'polished';
import React from 'react';
import {Link} from 'react-router-dom';
import styled, {css} from 'styled-components';

import {CURRENT_SEASON, LATEST_SEASON} from '../../lib/constants';
import {getNationalChampionshipYears} from '../../lib/utils';
import {FlexRow} from '../common/Flex';

const NavMenuDecadeWrapper = styled.div`
  flex: 1;
  padding: 8px;
  margin: 32px 12px 0 0;
  border: solid 3px ${({theme}) => theme.colors.black};
  background-color: ${({theme}) => theme.colors.gold}66;

  &:last-of-type {
    max-width: 218px;
  }

  @media (max-width: 700px) {
    &:last-of-type {
      max-width: none;
    }
  }

  @media (max-width: 480px) {
    margin-left: 12px;
    margin-right: 24px;

    &:last-of-type {
      margin-bottom: 24px;
    }
  }
`;

export const MavMenuDecadeHeader = styled(FlexRow).attrs({justify: 'center'})`
  margin-top: -28px;
  -webkit-text-stroke: 1px; /* TODO: cross-browser solution */
  -webkit-text-stroke-color: ${({theme}) => darken(0.2, theme.colors.black)};
  text-shadow: ${({theme}) => theme.colors.black} 2px 2px;

  p {
    font-family: 'Bungee';
    font-size: 20px;
    color: ${({theme}) => theme.colors.white};
    display: inline-block;
    padding: 4px 8px;
    background-color: ${({theme}) => theme.colors.green}; /* $primary-blue */
    border: solid 3px ${({theme}) => theme.colors.black};
  }

  p span {
    font-size: 16px;
  }
`;

const NavMenuDecadeYearsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 2px;
  margin-top: 4px;
`;

interface NavMenuDecadeYearProps {
  readonly $isCurrentYear: boolean;
  readonly $isSelectedYear: boolean;
  readonly $isChampionshipYear: boolean;
}

const NavMenuDecadeYear = styled(Link)<NavMenuDecadeYearProps>`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-self: center;
  justify-content: center;
  text-decoration: none;
  font-size: 16px;
  font-family: 'Inter', serif;
  color: ${({theme}) => theme.colors.black};

  &:hover {
    color: ${({theme}) => theme.colors.white};
    background-color: ${({theme}) => theme.colors.black}20;
  }

  ${({$isChampionshipYear}) =>
    $isChampionshipYear
      ? css`
          background-image: repeating-linear-gradient(
            135deg,
            ${({theme}) => darken(0.2, theme.colors.green)}40,
            ${({theme}) => darken(0.2, theme.colors.green)}40 1px,
            transparent 2px,
            transparent 2px,
            ${({theme}) => darken(0.2, theme.colors.green)}40 3px
          );

          &:hover {
            color: ${({theme}) => theme.colors.white};
          }
        `
      : null}

  ${({$isCurrentYear}) =>
    $isCurrentYear
      ? css`
          background-image: repeating-linear-gradient(
            -135deg,
            ${({theme}) => darken(0.2, theme.colors.blue)}40,
            ${({theme}) => darken(0.2, theme.colors.blue)}40 1px,
            transparent 2px,
            transparent 2px,
            ${({theme}) => darken(0.2, theme.colors.blue)}40 3px
          );
        `
      : null}

  ${({$isSelectedYear}) =>
    $isSelectedYear
      ? css`
          font-weight: bold;
          background-color: ${({theme}) => theme.colors.gold};
        `
      : null}

  @media (max-width: 480px) {
    width: 44px;
    height: 44px;
  }
`;

export const NavMenuDecade: React.FC<{
  readonly startingYear: number;
  readonly selectedSeason: number;
  readonly onClick: () => void;
}> = ({startingYear, selectedSeason, onClick}) => {
  let yearsRange = rangeRight(startingYear, startingYear + 10);
  if (startingYear === 1880) {
    yearsRange = [1889, 1888, 1887];
  }

  const decadeContent = yearsRange.map((year) => {
    let yearEnding = String(year % 100);
    if (yearEnding.length === 1) {
      yearEnding = '0' + yearEnding;
    }

    // Notre Dame did not field a team in 1980 or 1981.
    if (year === 1890 || year === 1891 || year > LATEST_SEASON) {
      return <p key={year} />;
    }

    return (
      <NavMenuDecadeYear
        key={year}
        to={`/${year}`}
        $isCurrentYear={year === CURRENT_SEASON}
        $isSelectedYear={year === selectedSeason}
        $isChampionshipYear={getNationalChampionshipYears().includes(year)}
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
