import _ from 'lodash';
import React from 'react';
import {Helmet} from 'react-helmet';

import Table from '../../../charts/Table';
import LineChart from '../../../charts/LineChart';
import NewsletterSignupForm from '../../../common/NewsletterSignupForm';
import LosslessRecordLineGraph from './LosslessRecordLineGraph';

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

import {SliderRangeWrapper} from './index.styles';

import {getNdFirstLossSeriesData, getAllTeamFirstLossSeriesData} from './dataHelpers';

import alabamaRecordsUnderSaban from './data/alabamaRecordsUnderSaban.json';
import firstWeekLossPercentagesPerSeason from './data/firstWeekLossPercentagesPerSeason.json';

const title = 'Chasing Perfection';
const subtitle = 'When Teams Stumble En Route To An Undefeated Season';

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

export default class S1E2 extends React.Component {
  state = {
    ndFirstLossSeriesData_1887_2017: getNdFirstLossSeriesData(1887, 2017),
    allFirstLossSeriesData_1887_2017: getAllTeamFirstLossSeriesData(1887, 2017),
    ndFirstLossSeriesData_1990_2017: getNdFirstLossSeriesData(1990, 2017),
    ndFirstLossSeriesData_2010_2017: getNdFirstLossSeriesData(2010, 2017),
    ndFirstLossSeriesData_1943_1949: getNdFirstLossSeriesData(1943, 1949),
    ndFirstLossSeriesData_interactive: getNdFirstLossSeriesData(1887, 2017),
  };

  onNdSeasonsChange = ([startSeason, endSeason]) => {
    this.setState({
      ndFirstLossSeriesData_interactive: getNdFirstLossSeriesData(startSeason, endSeason),
    });
  };

  render() {
    const {
      ndFirstLossSeriesData_1887_2017,
      allFirstLossSeriesData_1887_2017,
      ndFirstLossSeriesData_1990_2017,
      ndFirstLossSeriesData_2010_2017,
      ndFirstLossSeriesData_1943_1949,
      ndFirstLossSeriesData_interactive,
    } = this.state;

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

        <Subtitle>{subtitle}</Subtitle>

        <Byline>
          <p>October 25, 2018</p>
          <StyledExternalLink href="https://jwn.gr">Jacob Wenger</StyledExternalLink>
        </Byline>

        <Table
          headers={['Season', 'Record', 'Final AP Ranking']}
          rows={alabamaRecordsUnderSaban}
          highlightedRowIndexes={[2]}
        />

        <Caption>
          Despite Alabama's dominance under Nick Saban, there has only been a single season during
          his tenure in which they have gone undefeated.
        </Caption>

        <P>ND CHART:</P>

        <LosslessRecordLineGraph seriesData={ndFirstLossSeriesData_1887_2017} />

        <LosslessRecordLineGraph seriesData={allFirstLossSeriesData_1887_2017} />

        <LosslessRecordLineGraph seriesData={ndFirstLossSeriesData_1990_2017} />

        <LosslessRecordLineGraph seriesData={ndFirstLossSeriesData_2010_2017} />

        <LosslessRecordLineGraph seriesData={ndFirstLossSeriesData_1943_1949} />

        <LosslessRecordLineGraph seriesData={ndFirstLossSeriesData_interactive}>
          <SliderRangeWrapper min={1887} max={2017} onChange={this.onNdSeasonsChange} />
        </LosslessRecordLineGraph>

        <P>SEASON AVERAGE CHART:</P>

        {/* <LineChart
          seriesData={seasonAverageFirstLossSeriesData}
          domainY={[0, 100]}
          showLine={true}
        />

        <P>ND SINCE 1990 CHART:</P>

        <LineChart seriesData={ndSince1990FirstLossSeriesData} domainY={[0, 100]} showLine={true} />

        <P>SEASON AVERAGE SINCE 1990 CHART:</P>

        <LineChart
          seriesData={seasonAverageSince1990FirstLossSeriesData}
          domainY={[0, 100]}
          showLine={true}
        />

        <P>SEASON CHART:</P>

        <LineChart seriesData={seasonFirstLossSeriesData} domainY={[0, 100]} showLine={true} /> */}

        <Divider />

        <NewsletterSignupForm />
      </Wrapper>
    );
  }
}
