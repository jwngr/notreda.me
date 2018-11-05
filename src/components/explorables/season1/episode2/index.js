import _ from 'lodash';
import React from 'react';
import {Helmet} from 'react-helmet';

import Table from '../../../charts/Table';
import NewsletterSignupForm from '../../../common/NewsletterSignupForm';
import LosslessRecordLineGraph from './LosslessRecordLineGraph';

import {
  P,
  Title,
  Byline,
  Caption,
  Heading,
  Divider,
  Wrapper,
  Subtitle,
  SectionTitle,
  StyledExternalLink,
} from '../../index.styles';

import {SliderRangeWrapper} from './index.styles';

import {
  getNdFirstLossSeriesData,
  getAllTeamFirstLossSeriesData,
  getNdUndefeatedSeasonTableData,
  getUndefeatedTeamCountsPerSeasonTableData,
  getUndefeatedSeasonCountsPerTeamTableData,
} from './dataHelpers';

import alabamaRecordsUnderSaban from './data/alabamaRecordsUnderSaban.json';
import firstWeekLossPercentagesPerSeason from './data/firstWeekLossPercentagesPerSeason.json';

const title = 'Chasing Perfection';
const subtitle = 'When Teams Stumble En Route To Undefeated Seasons';

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
    ndUndefeatedSeasonTableData: getNdUndefeatedSeasonTableData(),
    ndFirstLossSeriesData_1887_2017: getNdFirstLossSeriesData(1887, 2017),
    allFirstLossSeriesData_1887_2017: getAllTeamFirstLossSeriesData(1887, 2017),
    ndFirstLossSeriesData_1990_2017: getNdFirstLossSeriesData(1990, 2017),
    ndFirstLossSeriesData_2010_2017: getNdFirstLossSeriesData(2010, 2017),
    ndFirstLossSeriesData_1943_1949: getNdFirstLossSeriesData(1943, 1949),
    ndFirstLossSeriesData_interactive: getNdFirstLossSeriesData(1887, 2017),
    undefeatedTeamCountsPerSeasonTableData: getUndefeatedTeamCountsPerSeasonTableData(1869, 2017),
    undefeatedSeasonCountsPerTeamTableData_1869_2017: getUndefeatedSeasonCountsPerTeamTableData(
      1869,
      2017
    ),
    undefeatedSeasonCountsPerTeamTableData_1917_2017: getUndefeatedSeasonCountsPerTeamTableData(
      1917,
      2017
    ),
  };

  onNdSeasonsChange = ([startSeason, endSeason]) => {
    this.setState({
      ndFirstLossSeriesData_interactive: getNdFirstLossSeriesData(startSeason, endSeason),
    });
  };

  render() {
    const {
      ndUndefeatedSeasonTableData,
      ndFirstLossSeriesData_1887_2017,
      allFirstLossSeriesData_1887_2017,
      ndFirstLossSeriesData_1990_2017,
      ndFirstLossSeriesData_2010_2017,
      ndFirstLossSeriesData_1943_1949,
      ndFirstLossSeriesData_interactive,
      undefeatedTeamCountsPerSeasonTableData,
      undefeatedSeasonCountsPerTeamTableData_1869_2017,
      undefeatedSeasonCountsPerTeamTableData_1917_2017,
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
          <p>November 7, 2018</p>
          <StyledExternalLink href="https://jwn.gr">Jacob Wenger</StyledExternalLink>
        </Byline>

        <P>
          Winning is hard; going undefeated, harder still. Alabama is a prime example. A college
          football juggernaut for the past decade, the Tide have compiled a 141-20 record and five
          National Championships since Nick Saban took over the program in 2007. And that includes a
          7-6 record in Saban's freshman season and a plethora of postseason contests.
        </P>

        <P>
          Given those somewhat staggering numbers, one would expect Saban's team to have accrued at
          least a few undefeated seasons during his tenure. But they haven't. In fact, they only
          went undefeated once in that span, all the way back in 2009.
        </P>

        <Table
          headers={['Season', 'Record', 'Final AP Ranking']}
          rows={alabamaRecordsUnderSaban}
          highlightedRowIndexes={[2]}
        />

        <Caption>
          Despite Alabama's dominance under Nick Saban, there has only been a single season during
          his tenure in which they have gone undefeated.
        </Caption>

        <P>
          Undefeated seasons are special because of their rarity in the modern game. We simply need
          to think back to Sun Life Stadium against Alabama to realize just how quickly they can
          come crashing down. Sometimes a team loses its opener and the dream of an undefeated
          season is over almost before it even started. Other times, they piece together a season
          full of nail-biter and blowout wins to climb to the top of the rankings, until they are
          exposed late in the season. With the modern four team playoff, a single loss doesn't
          necessarily mean your season is over, but it does ruin the undefeated dream.
        </P>

        <P>
          After a win over Northwestern, Notre Dame sits at 9-0, one of only three undefeated teams
          left in the country. It's hard to hear any discussion about the Irish without a mention of
          them potentially winning out. Many think they'll need to in order to win their first
          National Championship since 1988. But even making it to this point in the season is a feat
          in and of itself. Let's dive into the history books to see just how impressive it is.
        </P>

        <SectionTitle>When Notre Dame Loses</SectionTitle>

        <P>
          Notre Dame has been playing football for a <i>long</i> time. Excluding the 1890 and 1891
          seasons, they've fielded a team every year since 1887, making 2018 the 130th season of
          Irish football. 15 of those past seasons (11.6%) ended with a zero in the loss column
          while the remaining 114 saw a loss at some point. But those losses came spread across
          different points in the season. Sometimes the Irish lost the opener while others the Irish
          first loss came in a postseason bowl game. To get an idea for when Notre Dame has lost, we
          can chart the percentage of seasons in which they have achieved a certain undefeated
          record.
        </P>

        <LosslessRecordLineGraph seriesData={ndFirstLossSeriesData_1887_2017} />

        <P>
          Notre Dame rarely loses their opening game, although recent examples include their
          high-scoring 2016 overtime affair in Austin and that dreadful lightning delayed opener
          against USF in 2011. But 87.6% of the time, Notre Dame takes care of business and makes it
          to 1-0. The numbers drop precipitously from there, with Notre Dame making it to 2-0 in
          around two-thirds of all seasons and to 3-0 in just a hair under half of the time. From
          there, it's a somewhat gradual downward slope through 8-0 (a quarter of all seasons) to
          10-0 (a seventh of all seasons) to 12-0 (only twice, in 1988 and 2012) until finally
          coming to rest at 13-0, which the Irish have never achieved.
        </P>

        <P>
          <i>
            <b>Note:</b> For much of its history, Notre Dame played seasons with far fewer than
            modern 12-14 games. The data above is normalized to only include seasons in which Notre
            Dame played at least that many games. So although Notre Dame has only reached 12-0 twice
            in 129 seasons (just 1.5%), the chart above only considers the 36 seasons in which they
            have played at least 12 games, resulting in a value of 5.6%.
          </i>
        </P>

        <P>
          The numbers above seem fairly respectable. If you pick any of Notre Dame's seasons in
          which they've played as many games as this season out of a hat, there is about a one in
          five chance they'd be undefeated like they are in 2018. For fans who have been watching
          Notre Dame for the past few decades, this may seem somewhat high. And that would be fair,
          since Notre Dame hasn't exactly been the juggernaut it used to be as of late. So let's
          just look at the same graph only including seasons dating back to 1990.
        </P>

        <LosslessRecordLineGraph seriesData={ndFirstLossSeriesData_1990_2017} />

        <P>
          Ouch! That looks a bit... worse. But it is a more accurate picture of the Irish in recent
          times. And it shows that this year's 9-0 record is quite special, happening just two times
          before (1993 and 2012) since 1990. And yes, I am cherry-picking numbers a bit here since
          Notre Dame won a National Championship with an undefeated season in 1988 and won their
          first 11 en route to a #2 finish in 1989. But even including those seasons, the chart
          doesn't look great in comparison to their historical marks. And for even more fun, here is
          the chart since Brian Kelly took over in 2010 (remember that the current 2018 season is
          not included in this data):
        </P>

        <LosslessRecordLineGraph seriesData={ndFirstLossSeriesData_2010_2017} />

        <P>
          Here is the view of Notre Dame's dynasty from 1943-1949 predominantly led by head coach
          Frank Leahy, a stretch during which Notre Dame went 60-5-1 and won four National
          Championships:
        </P>

        <LosslessRecordLineGraph seriesData={ndFirstLossSeriesData_1943_1949} />

        <P>
          There are a lot of other interesting ways to inspect this data, so here is an interactive
          version of the chart which allows you to choose any range of seasons. Move the slider in
          the top right of the graph to see for yourself how the data changes over time.
        </P>

        <LosslessRecordLineGraph seriesData={ndFirstLossSeriesData_interactive}>
          <SliderRangeWrapper min={1887} max={2017} onChange={this.onNdSeasonsChange} />
        </LosslessRecordLineGraph>

        <SectionTitle>When Everyone Else Loses</SectionTitle>

        <P>
          As we saw in the last episode of Explorables, looking at Notre Dame's statistics in
          isolation is not enough. We need to bring in the context from the competition. If we
          create a chart like before but instead aggregate data from every team since 1887, we get
          something like this:
        </P>

        <LosslessRecordLineGraph seriesData={allFirstLossSeriesData_1887_2017} />

        <SectionTitle>When Teams Do Not Lose</SectionTitle>

        <P>
          Dating back to 1869 - the first season of intercollegiate football in the United States -
          there have been 423 teams who went undefeated. Nearly a third of those 149 football
          seasons ended with four or more undefeated teams, including two years - 1910 and 1920 -
          which saw a record ten undefeated teams. However, it has been 46 years since a season
          ended with more four or more undefeated teams. That 1973 season was noteworthy for Notre
          Dame as they claimed a National Championship with a 24-23 Sugar Bowl win over #1 Alabama
          in the first matchup between those two teams. With increased parity across the league,
          longer regular season schedules, and the modern-day bowl and playoff system, we will
          likely not see more than three undefeated teams any time soon.
        </P>

        <Table
          headers={['Undefeated Teams', 'Seasons', 'Latest']}
          rows={undefeatedTeamCountsPerSeasonTableData}
        />

        <Caption>
          Ending the season with four or more undefeated teams seems impossible in the modern game,
          but it was quite common during the early years of the sport.
        </Caption>

        <P>
          <i>
            <b>Note:</b> An undefeated season is considered any season, regardless of length,
            without a single loss. Teams can have undefeated seasons with ties.
          </i>
        </P>

        <P>
          A few unexpected schools claim a disproportionate amount of undefeated seasons. Three Ivy
          League institutions who have not really been relevant in the college football landscape in
          nearly half a century find themselves alongside Notre Dame and Michigan to round out the
          top five.
        </P>

        <Table
          headers={['Team Name', 'Undefeated Seasons Since 1869', 'Latest']}
          rows={undefeatedSeasonCountsPerTeamTableData_1869_2017}
          highlightedRowIndexes={[3]}
        />

        <Caption>
          There are some surprising names on the list of schools with the most undefeated seasons.
        </Caption>

        <P>
          The table above is accurate according to the official records, but it does not take into
          account that Princeton, Yale, and Harvard are some of the oldest football programs and
          went lossless in seasons in which they only played a handful of games. In fact, in
          Princeton's first six undefeated seasons, they played a total of 10 games, less than
          modern teams play in a single season. If we take a more recent snapshot, say the last 100
          years of college football, a familiar name comes out on top.
        </P>

        <Table
          headers={['Team Name', 'Undefeated Seasons Since 1917', 'Latest']}
          rows={undefeatedSeasonCountsPerTeamTableData_1917_2017}
          highlightedRowIndexes={[0]}
        />

        <Caption>
          Notre Dame has had more undefeated seasons than any other school over the past century.
        </Caption>

        <SectionTitle>Chasing Undefeated Season #16</SectionTitle>

        <P>
          Notre Dame sits at 9-0, five wins away from the school's 16th undefeated season. It would
          be their first since they last won a National Championship in 1988. Even making it to this
          point in the season undefeated puts the Irish with as many wins as they finished with in
          two-thirds of their all-time undefeated seasons.
        </P>

        <Table headers={['Season', 'Games Played', 'Record']} rows={ndUndefeatedSeasonTableData} />

        <Caption>
          The 2018 Irish team has already notched as many wins as they had in 10 of their 15
          all-time undefeated seasons.
        </Caption>

        <P>
          Notre Dame's next obstacle is a senior day home game against a 4-5 Florida State who has a
          solitary win outside Tallahassee this season, a 28-24 victory over an equally terrible
          Louisville team. History is on the line as the Irish continue their chase for perfection.
        </P>

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
