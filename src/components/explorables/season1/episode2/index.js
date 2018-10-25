import _ from 'lodash';
import React from 'react';
import {Helmet} from 'react-helmet';

import LineChart from '../../../charts/LineChart';
import NewsletterSignupForm from '../../../common/NewsletterSignupForm';

import {
  P,
  Stat,
  Image,
  Title,
  Byline,
  Caption,
  Heading,
  Divider,
  Wrapper,
  Subtitle,
  StatsWrapper,
  SectionTitle,
  StyledExternalLink,
} from '../../index.styles';

import ndFirstWeekLossPercentages from './data/ndFirstWeekLossPercentages.json';
import firstWeekLossPercentagesPerSeason from './data/firstWeekLossPercentagesPerSeason.json';

const title = 'Chasing Perfection';

const ndFirstLossSeriesData = [
  {
    id: 'firstLoss',
    values: ndFirstWeekLossPercentages.alltime.map((val, i) => ({
      x: i + 1,
      y: 100 - val,
      radius: 6,
      tooltipChildren: (
        <div>
          <p>{(100 - val).toFixed(1)}%</p>
        </div>
      ),
    })),
  },
];

const ndSince1990FirstLossSeriesData = [
  {
    id: 'firstLoss',
    values: ndFirstWeekLossPercentages.since1990.map((val, i) => ({
      x: i + 1,
      y: 100 - val,
      radius: 6,
      tooltipChildren: (
        <div>
          <p>{(100 - val).toFixed(1)}%</p>
        </div>
      ),
    })),
  },
];

const seasonFirstLossSeriesData = [];
const seasonAverageFirstLossSeriesData = [];
const seasonAverageSince1990FirstLossSeriesData = [];
_.forEach(firstWeekLossPercentagesPerSeason, (seasonData, season) => {
  const seriesData = {
    id: `firstLoss-${season}`,
    values: (seasonData.firstWeekLossPercentages || seasonData).map((val, i) => ({
      x: i + 1,
      y: 100 - val,
      radius: 4,
      tooltipChildren: (
        <div>
          <p>{(100 - val).toFixed(1)}%</p>
        </div>
      ),
    })),
  };

  if (season === 'averages') {
    seasonAverageFirstLossSeriesData.push(seriesData);
  } else if (season === 'averagesSince1990') {
    seasonAverageSince1990FirstLossSeriesData.push(seriesData);
  } else {
    seasonFirstLossSeriesData.push(seriesData);
  }
});

export default () => {
  return (
    <Wrapper>
      <Helmet>
        <title>{`${title} | notreda.me`}</title>
      </Helmet>

      <Heading>
        <p>Explorables</p>
        <p>Season 1, Episode 2</p>
      </Heading>

      <Title>{title}</Title>

      <Subtitle>Which Week Teams Typically Falter</Subtitle>

      <Byline>
        <p>October 25, 2018</p>
        <StyledExternalLink href="https://jwn.gr">Jacob Wenger</StyledExternalLink>
      </Byline>

      <P>ND CHART:</P>

      <LineChart seriesData={ndFirstLossSeriesData} domainY={[0, 100]} showLine={true} />

      <P>SEASON AVERAGE CHART:</P>

      <LineChart seriesData={seasonAverageFirstLossSeriesData} domainY={[0, 100]} showLine={true} />

      <P>ND SINCE 1990 CHART:</P>

      <LineChart seriesData={ndSince1990FirstLossSeriesData} domainY={[0, 100]} showLine={true} />

      <P>SEASON AVERAGE SINCE 1990 CHART:</P>

      <LineChart
        seriesData={seasonAverageSince1990FirstLossSeriesData}
        domainY={[0, 100]}
        showLine={true}
      />

      <P>SEASON CHART:</P>

      <LineChart seriesData={seasonFirstLossSeriesData} domainY={[0, 100]} showLine={true} />

      <Divider />

      <NewsletterSignupForm />
    </Wrapper>
  );
};
