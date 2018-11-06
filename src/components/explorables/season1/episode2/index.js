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
          football juggernaut for the past decade, the Crimson Tide have compiled an enviable 141-20
          record and racked up five National Championships since Nick Saban took over the program in
          2007. All that despite a 7-6 record in Saban's inaugural season in Tuscaloosa and a near
          constant stream of postseason contests against other elite programs.
        </P>

        <P>
          Given those somewhat staggering numbers, one would expect Saban's team to have accrued at
          least a few undefeated seasons during his tenure. But they haven't. In fact, they have
          only gone undefeated once in that span, all the way back in 2009.
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
          Undefeated seasons are special because of their rarity in the modern game, and how quickly
          they can be snuffed out. Sometimes a team loses its opener and the dream of an undefeated
          season is over almost before it even starts. Other times, they string together a series of
          nail-biter and blowout wins to climb to the top of the rankings, until they are exposed
          late in the season. Irish fans need only think back to the{' '}
          <StyledExternalLink href="/2012/13">
            thrashing Alabama put on them in Sun Life Stadium back in 2012
          </StyledExternalLink>{' '}
          to remember how quickly the dream of an undefeated season can turn into a nightmare. And
          while the modern playoff system makes it so that a single loss no longer spells the end of
          a team's National Championship aspirations, there is something special about ending the
          season with no losses.
        </P>

        <P>
          After a <StyledExternalLink href="/2018/9">road win over Northwestern</StyledExternalLink>
          , Notre Dame sits at an unblemished 9-0, one of only three undefeated teams left in the
          country (along with Alabama and UCF). It is nearly impossible to read or listen to
          anything about Notre Dame football without the topic turning to them potentially winning
          out. While everyone else looks ahead, we should not forget that even making it to this
          point in the season without any losses is a feat that should be celebrated. Let's dive
          into the record books to see just how impressive it is.
        </P>

        <SectionTitle>When Notre Dame Loses</SectionTitle>

        <P>
          Notre Dame has been playing football for a <i>long</i> time. Excluding the 1890 and 1891
          seasons, they have fielded a team every year since 1887, making 2018 the 130th season of
          Fighting Irish football. 15 of those past seasons (11.6%) ended with a zero in the loss
          column while they suffered at least one loss in the remaining 114. Naturally, those losses
          came spread across different points in the season. They lost their opener in some seasons
          while, in others, they did not lose until their postseason bowl game. To get an idea for
          at which point in the season Notre Dame has historically suffered their first loss, we can
          chart the percentage of seasons in which they have played a certain number of games before
          their first loss.
        </P>

        <LosslessRecordLineGraph seriesData={ndFirstLossSeriesData_1887_2017} />

        <Caption>
          Notre Dame has historically looked strong early in the season and typically made it a few
          games into the season before suffering their first loss.
        </Caption>

        <P>
          <i>
            <b>Note:</b> The number of games played before their first loss includes both wins and
            ties.
          </i>
        </P>

        <P>
          Notre Dame rarely loses its opening game, despite recent examples including a{' '}
          <StyledExternalLink href="/2016/1">
            high-scoring 2016 overtime affair in Austin
          </StyledExternalLink>{' '}
          and a{' '}
          <StyledExternalLink href="/2011/1">
            lightning-delayed opener against USF in 2011
          </StyledExternalLink>
          . In roughly 9 out of every 10 seasons, Notre Dame takes care of business and makes it
          through their first game unscathed. The numbers drop precipitously from there, with Notre
          Dame making it 2 games into the season without a loss in around two-thirds of all seasons
          and 3 games in just a hair under half. From there, it's a somewhat gradual downward slope
          through 8 games (a quarter of all seasons) to 10 games (a seventh of all seasons) to 12
          games (only twice, in 1988 and 2012) until finally coming to rest at 13 games, a point at
          which they have never reached undefeated.
        </P>

        <P>
          <i>
            <b>Note:</b> For much of its history, Notre Dame played seasons with far fewer than the
            modern 12-14 games. The percentages above are normalized to only include seasons in
            which Notre Dame played at least that many games. So, although Notre Dame has only
            reached 12-0 twice in 129 seasons (just 1.5% of all seasons), the chart above only
            considers the 36 seasons in which they have played at least 12 games, resulting in a
            value of 5.6%.
          </i>
        </P>

        <P>
          These numbers seem fairly respectable. If you choose any past Notre Dame season in which
          they played at least nine games, there is a little over 1 in 5 chance they would be
          undefeated as they are this year. For fans like myself who have only been watching for the
          past couple decades, this may seem pretty surprising. And that would be fair, since Irish
          football has not exactly been playing like the behemoth it once was, as evidency by the
          looking at the same chart as above using only seasons dating back to 1990.
        </P>

        <LosslessRecordLineGraph seriesData={ndFirstLossSeriesData_1990_2017} />

        <Caption>
          Looking only at seasons since 1990, the numbers look much worse, with Notre Dame more
          often than not picking up a loss in one of their first two games.
        </Caption>

        <P>
          Ouch! That looks quick a bit worse. But it is a more accurate picture of the Irish in
          recent times. And it shows that this year's 9-0 record is quite special, happening just
          two times (1993 and 2012) since 1990. And yes, I am cherry-picking the numbers a bit here
          since Notre Dame happened to win a National Championship with an undefeated season in 1988
          and won their first 11 en route to a #2 finish in 1989. But even including those seasons,
          the chart doesn't look great in comparison to their historical marks. To drive home this
          point, look at the same chart covering the seasons since Brian Kelly took over in 2010
          (remember that the current 2018 season is not included in this data):
        </P>

        <LosslessRecordLineGraph seriesData={ndFirstLossSeriesData_2010_2017} />

        <Caption>
          The 2012 season sticks out like a sore thumb when only looking at seasons during Brian
          Kelly's tenure.
        </Caption>

        <P>
          How does this compare to the the peak of the program? Let's look at the same chart
          covering the span of Notre Dame's most dominant dynasty from 1943-1949, predominantly led
          by head coach Frank Leahy. During that seven year stretch, Notre Dame amassed a 60-5-1
          record, <StyledExternalLink href="/1943/">won</StyledExternalLink>{' '}
          <StyledExternalLink href="/1946/">four</StyledExternalLink>{' '}
          <StyledExternalLink href="/1947/">National</StyledExternalLink>{' '}
          <StyledExternalLink href="/1949/">Championships</StyledExternalLink> National
          Championships, and won at least the first five games of each season.
        </P>

        <LosslessRecordLineGraph seriesData={ndFirstLossSeriesData_1943_1949} />

        <Caption>
          The Fighting Irish football dynasty from 1943 to 1949 was a near-unstoppable force.
        </Caption>

        <P>
          There are too many interesting stretches of Notre Dame football history to cover in this
          blog post, so here is an interactive version of the chart which allows you to analyze the
          data over any range of seasons.
        </P>

        <LosslessRecordLineGraph seriesData={ndFirstLossSeriesData_interactive}>
          <SliderRangeWrapper min={1887} max={2017} onChange={this.onNdSeasonsChange} />
        </LosslessRecordLineGraph>

        <Caption>
          This chart is interactive! Use the slider in the top right of the graph to see for
          yourself how the data changes over time.
        </Caption>

        <SectionTitle>When Everyone Else Loses</SectionTitle>

        <P>
          As we saw in{' '}
          <StyledExternalLink href="/explorabes/s1e1-down-to-the-wire">
            "Down To The Wire,"
          </StyledExternalLink>{' '}
          looking at Notre Dame's statistics in isolation is not enough. We need to also look at the
          competition. So let's look at a similar chart with aggregate data from every major college
          football team dating back to 1887.
        </P>

        <LosslessRecordLineGraph seriesData={allFirstLossSeriesData_1887_2017} />

        <Caption>
          Notre Dame's numbers look pretty good when compared to aggregate data from every college
          football team since 1887.
        </Caption>

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

        <SectionTitle>When Teams Do Not Lose</SectionTitle>

        <P>
          Enough talk about losses; let's look at those teams which never lost. Dating back to 1869
          &mdash; the first season of intercollegiate football in the United States &mdash; there
          have been 423 teams who have gone undefeated. Nearly a third of those 149 football seasons
          ended with four or more undefeated teams, including two years &mdash; 1910 and 1920
          &mdash; which saw a record ten undefeated teams. However, it has been 46 years since a
          season ended with more four or more undefeated teams. That particular 1973 season was
          noteworthy for Notre Dame as they claimed a National Championship with a{' '}
          <StyledExternalLink href="/1973/11/">
            24-23 Sugar Bowl win over then-#1 Alabama
          </StyledExternalLink>{' '}
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
            <b>Note:</b> An undefeated season is considered any season, regardless of length, in
            which a team did not have a single loss, even if that team had one or more ties.
          </i>
        </P>

        <P>
          A few unexpected schools claim a disproportionate number of undefeated seasons. Three Ivy
          League institutions who no longer even play in the top division of college football round
          out the top five with the perennial and seemingly resurgent powerhouses of Notre Dame and
          Michigan.
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
          <i>
            <b>Note:</b> Only seasons during which a school played in the top-division of college
            football are included. For example, Harvard went undefeated in 2014, but since they now
            play in the Football Championship Subdivision, it is not included in the table above.
          </i>
        </P>

        <P>
          The table above is accurate according to the official records, but it does not take into
          account that Princeton, Yale, and Harvard are some of the oldest football programs and
          went lossless in seasons in which they only played a handful of games. In fact, in
          Princeton's first six undefeated seasons, they played a total of just 10 games, less than
          modern teams play in a single season. If we take a more recent snapshot, say the last 100
          years of college football, a familiar name leads the pack.
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
          be their first since they last{' '}
          <StyledExternalLink href="/1988/">won a National Championship in 1988</StyledExternalLink>
          . But, as we saw above, even making it to this point in the season without a loss puts the
          Irish in rare company. In fact, the Irish have started this season with as many wins as
          they finished with in two-thirds of their all-time undefeated seasons.
        </P>

        <Table
          headers={['Season', 'Games Played', 'Record']}
          rows={ndUndefeatedSeasonTableData}
          highlightedRowIndexes={[3, 5, 10, 13, 14]}
        />

        <Caption>
          The 2018 Irish team has already notched as many wins as they had in all be 5 of their 15
          all-time undefeated seasons.
        </Caption>

        <P>
          Notre Dame's next obstacle is a senior day{' '}
          <StyledExternalLink href="/2018/10/">
            home game against a 4-5 Florida State
          </StyledExternalLink>{' '}
          who has a solitary win outside Tallahassee this season, a 28-24 victory over an equally
          terrible Louisville team. History is on the line as the Irish continue their chase for
          perfection.
        </P>

        <Divider />

        <NewsletterSignupForm />
      </Wrapper>
    );
  }
}
