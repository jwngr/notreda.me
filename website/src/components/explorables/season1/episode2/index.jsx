import React from 'react';
import {Helmet} from 'react-helmet';
import {Link} from 'react-router-dom';

import {PerSeasonBarChart} from '../../../charts/PerSeasonBarChart';
import {Table} from '../../../charts/Table';
import {NewsletterSignupForm} from '../../../common/NewsletterSignupForm';
import {
  Byline,
  Caption,
  Divider,
  Heading,
  Note,
  Paragraph,
  SectionTitle,
  StyledExternalLink,
  Subtitle,
  Title,
  Wrapper,
} from '../../index.styles';
import alabamaRecordsUnderSaban from './data/alabamaRecordsUnderSaban.json';
import {
  getAlabamaFirstLossSeriesData,
  getAllTeamFirstLossSeriesData,
  getNdFirstLossOverTimeBarChartData,
  getNdFirstLossSeriesData,
  getNdUndefeatedSeasonTableData,
  getUndefeatedSeasonCountsPerTeamTableData,
  getUndefeatedTeamCountsPerSeasonBarChartData,
  getUndefeatedTeamCountsPerSeasonTableData,
} from './dataHelpers';
import {Color, Legend, LosslessRecordLineGraphSeasons, SliderRangeWrapper} from './index.styles';
import {LosslessRecordLineGraph} from './LosslessRecordLineGraph';

const title = 'Chasing Perfection';
const subtitle = 'When Teams Stumble En Route To Undefeated Seasons';

export class ExplorablesS1E2 extends React.Component {
  state = {
    ndUndefeatedSeasonTableData: getNdUndefeatedSeasonTableData(),
    ndFirstLossSeriesData_1887_2017: getNdFirstLossSeriesData(1887, 2017),
    alabamaFirstLossSeriesData_2007_2017: getAlabamaFirstLossSeriesData(2007, 2017),
    allFirstLossSeriesData_interactiveStartSeason: 1917,
    allFirstLossSeriesData_interactiveEndSeason: 2017,
    allFirstLossSeriesData_interactive: getAllTeamFirstLossSeriesData(1917, 2017),
    allFirstLossSeriesData_1917_2017: getAllTeamFirstLossSeriesData(1917, 2017),
    ndFirstLossOverTimeBarChartData: getNdFirstLossOverTimeBarChartData(1887, 2017),
    ndFirstLossSeriesData_1990_2017: getNdFirstLossSeriesData(1990, 2017),
    ndFirstLossSeriesData_2010_2017: getNdFirstLossSeriesData(2010, 2017),
    ndFirstLossSeriesData_1943_1949: getNdFirstLossSeriesData(1943, 1949),
    ndFirstLossSeriesData_interactiveStartSeason: 1887,
    ndFirstLossSeriesData_interactiveEndSeason: 2017,
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
    undefeatedTeamCountsPerSeasonBarChartData: getUndefeatedTeamCountsPerSeasonBarChartData(
      1869,
      2017
    ),
  };

  onNdSeasonsChange = ([startSeason, endSeason]) => {
    this.setState({
      ndFirstLossSeriesData_interactiveStartSeason: startSeason,
      ndFirstLossSeriesData_interactiveEndSeason: endSeason,
      ndFirstLossSeriesData_interactive: getNdFirstLossSeriesData(startSeason, endSeason),
    });
  };

  onAllTeamsSeasonsChange = ([startSeason, endSeason]) => {
    this.setState({
      allFirstLossSeriesData_interactiveStartSeason: startSeason,
      allFirstLossSeriesData_interactiveEndSeason: endSeason,
      allFirstLossSeriesData_interactive: getAllTeamFirstLossSeriesData(startSeason, endSeason),
    });
  };

  render() {
    const {
      ndUndefeatedSeasonTableData,
      ndFirstLossSeriesData_1887_2017,
      ndFirstLossSeriesData_1990_2017,
      ndFirstLossSeriesData_2010_2017,
      ndFirstLossSeriesData_1943_1949,
      ndFirstLossOverTimeBarChartData,
      allFirstLossSeriesData_1917_2017,
      ndFirstLossSeriesData_interactive,
      allFirstLossSeriesData_interactive,
      alabamaFirstLossSeriesData_2007_2017,
      undefeatedTeamCountsPerSeasonTableData,
      undefeatedTeamCountsPerSeasonBarChartData,
      ndFirstLossSeriesData_interactiveEndSeason,
      ndFirstLossSeriesData_interactiveStartSeason,
      allFirstLossSeriesData_interactiveEndSeason,
      allFirstLossSeriesData_interactiveStartSeason,
      undefeatedSeasonCountsPerTeamTableData_1869_2017,
      undefeatedSeasonCountsPerTeamTableData_1917_2017,
    } = this.state;

    return (
      <Wrapper>
        <Helmet>
          <title>{`${title} | notreda.me`}</title>
        </Helmet>

        <Heading>
          <Link to="/explorables">Explorables</Link>
          <p>Season 1, Episode 2</p>
        </Heading>

        <Title>{title}</Title>

        <Subtitle>{subtitle}</Subtitle>

        <Byline>
          <p>November 7, 2018</p>
          <StyledExternalLink href="https://jwn.gr">Jacob Wenger</StyledExternalLink>
        </Byline>

        <Paragraph>
          Winning is hard; going undefeated, harder still. Alabama is a prime example. A college
          football juggernaut for the past decade, the Crimson Tide have compiled an enviable 141-20
          record and racked up five National Championships since Nick Saban took over the program in
          2007. All that despite a 7-6 record in Saban's inaugural season in Tuscaloosa and a near
          constant stream of postseason contests against other elite programs.
        </Paragraph>

        <Paragraph>
          Given those somewhat staggering numbers, one would expect Alabama to have accrued at least
          a few undefeated seasons during Saban's tenure. But they haven't. In fact, they have only
          gone undefeated once in that span, all the way back in 2009.
        </Paragraph>

        <Table
          headers={['Season', 'Record', 'Final AP Ranking']}
          rows={alabamaRecordsUnderSaban}
          highlightedRowIndexes={[2]}
        />

        <Caption>
          Despite Alabama's dominance under Nick Saban, the Crimson Tide have only gone undefeated
          one time during his tenure.
        </Caption>

        <Paragraph>
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
          a team's National Championship aspirations, there is something memorable about ending the
          season with no losses.
        </Paragraph>

        <Paragraph>
          After a <StyledExternalLink href="/2018/9">road win over Northwestern</StyledExternalLink>
          , Notre Dame sits at #3 in the latest College Football Playoff rankings with an
          unblemished 9-0 record, one of only four undefeated teams left in the country (along with
          #1 Alabama, #2 Clemson, and #12 UCF). It is nearly impossible to read or listen to
          anything about Notre Dame football without the topic turning to them potentially winning
          out. While everyone else looks ahead, we should not forget that even making it to this
          point in the season without any losses is a feat worth celebrating. Let's dive into the
          record books to see just how impressive it is.
        </Paragraph>

        <SectionTitle>When Notre Dame Loses</SectionTitle>

        <Paragraph>
          Notre Dame has been playing football for a <i>long</i> time. Excluding the 1890 and 1891
          seasons, they have fielded a team every year since 1887, making 2018 the 130th season of
          Fighting Irish football. 23 of those past seasons (17.8%) ended with a zero in the loss
          column, the remaining 106 containing at least one loss. Naturally, those losses came
          spread across different points in the season. They lost their opener in some seasons
          while, in others, they did not lose until their postseason bowl game. To get a feel for
          this, we can chart the percentage of all-time seasons in which Notre Dame played a certain
          number of games before suffering its first loss.
        </Paragraph>

        <LosslessRecordLineGraph seriesData={ndFirstLossSeriesData_1887_2017}>
          <LosslessRecordLineGraphSeasons>
            <b>ND:</b> 1887 - 2017
          </LosslessRecordLineGraphSeasons>
        </LosslessRecordLineGraph>

        <Caption>
          Notre Dame has historically looked strong early, typically making it a few games into the
          season before suffering its first loss.
        </Caption>

        <Paragraph>
          Notre Dame rarely loses its opening game. Despite recent examples including a{' '}
          <StyledExternalLink href="/2016/1">
            high-scoring 2016 overtime affair in Austin
          </StyledExternalLink>{' '}
          and a{' '}
          <StyledExternalLink href="/2011/1">
            lightning-delayed opener against USF in 2011
          </StyledExternalLink>
          , they take care of business and make it through the first game unscathed in nearly 9 out
          of every 10 seasons. The numbers drop precipitously from there, with Notre Dame making it
          2 games into the season without a loss in around two-thirds of all seasons and 3 games in
          just a hair under half. From there, it is a somewhat gradual downward slope through 8
          games (a quarter of all seasons) to 10 games (a seventh of all seasons) to 12 games (only
          twice, in <StyledExternalLink href="/1988/">1988</StyledExternalLink> and{' '}
          <StyledExternalLink href="/2012/">2012</StyledExternalLink>) until bottoming out at 13
          games, a point they have never reached undefeated.
        </Paragraph>

        <Note>
          For much of its history, Notre Dame played schedules with far fewer than the modern 12-14
          game slates. The percentages above are normalized to only include seasons in which Notre
          Dame played at least that many games. So, although Notre Dame only reached 12-0 twice in
          129 seasons (just 1.5% of all seasons), the chart above only considers the 36 seasons in
          which they have played at least 12 games, resulting in a value of 5.6%.
        </Note>

        <Paragraph>
          These numbers seem fairly respectable. If you choose any past Notre Dame season in which
          they played at least nine games, there is a little over 1 in 5 chance they would be
          undefeated at this point in the season. For fans like myself who have only been watching
          for the past couple decades, this may seem pretty surprising. And that would be fair,
          since Irish football is not exactly the behemoth it once was, as evidenced by only looking
          at seasons dating back to 1990.
        </Paragraph>

        <LosslessRecordLineGraph seriesData={ndFirstLossSeriesData_1990_2017}>
          <LosslessRecordLineGraphSeasons>
            <b>ND:</b> 1990 - 2017
          </LosslessRecordLineGraphSeasons>
        </LosslessRecordLineGraph>

        <Caption>
          For seasons since 1990, the numbers look much worse, with Notre Dame more often than not
          picking up a loss in one of its first two games.
        </Caption>

        <Paragraph>
          Ouch! That looks quick a bit worse. But it is a more accurate picture of the Irish in
          recent times. And it shows that this season's 9-0 record is quite special, happening just
          two times (<StyledExternalLink href="/1993/">1993</StyledExternalLink> and{' '}
          <StyledExternalLink href="/2012/">2012</StyledExternalLink>) since 1990. And yes, I am
          cherry-picking the numbers a bit here since Notre Dame happened to win a National
          Championship with an undefeated season in 1988 and won its first 11 games en route to a #2
          finish in 1989. But even including those seasons, the percentages do not favorably compare
          to the historical marks. To drive home this point, look at the same chart covering the
          seasons since Brian Kelly took over in 2010 (remembering that the current 2018 season is
          not included in this data).
        </Paragraph>

        <LosslessRecordLineGraph seriesData={ndFirstLossSeriesData_2010_2017}>
          <LosslessRecordLineGraphSeasons>
            <b>ND:</b> 2010 - 2017
          </LosslessRecordLineGraphSeasons>
        </LosslessRecordLineGraph>

        <Caption>
          During Brian Kelly's tenure, the 2012 season sticks out like a sore thumb amongst many
          early-season losses.
        </Caption>

        <Paragraph>
          How does this compare to the the peak of the program? Let's look at the same chart
          covering the span of Notre Dame's most dominant dynasty from 1943-1949, predominantly led
          by head coach Frank Leahy. During that seven season stretch, Notre Dame amassed a 60-5-1
          record, <StyledExternalLink href="/1943/">won</StyledExternalLink>{' '}
          <StyledExternalLink href="/1946/">four</StyledExternalLink>{' '}
          <StyledExternalLink href="/1947/">National</StyledExternalLink>{' '}
          <StyledExternalLink href="/1949/">Championships</StyledExternalLink>, and opened each
          season with at least five straight victories.
        </Paragraph>

        <LosslessRecordLineGraph seriesData={ndFirstLossSeriesData_1943_1949}>
          <LosslessRecordLineGraphSeasons>
            <b>ND:</b> 1943 - 1949
          </LosslessRecordLineGraphSeasons>
        </LosslessRecordLineGraph>

        <Caption>
          The Fighting Irish football dynasty from 1943 to 1949 was a near-unstoppable force that
          rarely lost, especially early in the season.
        </Caption>

        <Paragraph>
          There are too many interesting stretches of Notre Dame football history to cover in this
          blog post, so here is an interactive version of the chart which allows you to analyze the
          data over any consecutive range of seasons. Use it to compare the numbers for other former
          head coaches, to see how the Irish fared while you were a student, or just to see how it
          flattens out over time.
        </Paragraph>

        <LosslessRecordLineGraph seriesData={ndFirstLossSeriesData_interactive}>
          <SliderRangeWrapper
            min={1887}
            max={2017}
            onChange={this.onNdSeasonsChange}
            width={140}
            widthSm={140}
          />
          <LosslessRecordLineGraphSeasons>
            <b>ND:</b> {ndFirstLossSeriesData_interactiveStartSeason} -{' '}
            {ndFirstLossSeriesData_interactiveEndSeason}
          </LosslessRecordLineGraphSeasons>
        </LosslessRecordLineGraph>

        <Caption>
          This chart is interactive! Use the slider in the top right to see for yourself how the
          data changes over time.
        </Caption>

        <Paragraph>
          In addition to aggregating the data, we can also visualize how far into each individual
          season Notre Dame made it before encountering their first defeat.
        </Paragraph>

        <PerSeasonBarChart
          data={ndFirstLossOverTimeBarChartData}
          xAxisLabel="Season"
          yAxisLabel="Games Won Or Tied Before First Loss"
          margins={{left: 60, sm: {left: 48}}}
        />

        <Caption>
          The Notre Dame of modern times is less consistent at starting off strong than in decades
          past.
        </Caption>

        <Paragraph>
          This view of the data shows that Notre Dame is far from its days as a consistent
          powerhouse. Most of the seasons in which it lost one of its opening two games have come in
          recent decades. Notre Dame put together an impressive 36-year run from 1897 to 1932 in
          which they never lost an opener. Compare that to the 1984-86 seasons which all started at
          least 0-1 and a stretch from 1997 to 2011 in which they strung together more than two wins
          to kick off the season just once &mdash; an 8-0 start in{' '}
          <StyledExternalLink href="/2002/">2002</StyledExternalLink>. As was the case with 2012,
          the start of this current 2018 season bucks these recent trends and gives us a glimpse of
          the past.
        </Paragraph>

        <SectionTitle>When Everyone Else Loses</SectionTitle>

        <Paragraph>
          As we saw in{' '}
          <StyledExternalLink href="/explorables/s1e1-down-to-the-wire">
            "Down To The Wire"
          </StyledExternalLink>
          , Notre Dame's statistics in isolation are not enough. We need to also analyze the
          competition. So let's look at a similar chart with aggregate data from every major college
          football team dating back to 1887.
        </Paragraph>

        <LosslessRecordLineGraph seriesData={allFirstLossSeriesData_interactive}>
          <SliderRangeWrapper min={1917} max={2017} onChange={this.onAllTeamsSeasonsChange} />
          <LosslessRecordLineGraphSeasons>
            <b>All Teams:</b> {allFirstLossSeriesData_interactiveStartSeason} -{' '}
            {allFirstLossSeriesData_interactiveEndSeason}
          </LosslessRecordLineGraphSeasons>
        </LosslessRecordLineGraph>

        <Caption>
          Notre Dame's numbers look pretty good when compared to aggregate data from every college
          football team since 1887.
        </Caption>

        <Note>
          While you might expect half of all teams to lose their first game, the data above only
          includes teams in the top division (currently called the NCAA Division I Football Bowl
          Subdivision). Since many teams open their season with wins against teams from lower
          divisions, nearly two-thirds of teams have historically won or tied their opening game.
        </Note>

        <Paragraph>
          Notre Dame's historical numbers &mdash; and most of the marks under Brian Kelly &mdash;
          are better across the board, except of course for the few teams who have reached the
          heights of 13-0 and 14-0. No team has ever achieved a 15-0 record, although it is possible
          for those teams who sometimes schedule an extra 13th regular season game or play in a
          conference championship game.
        </Paragraph>

        <Paragraph>
          Coming back to Alabama's modern-day dynasty, charting their numbers under Saban looks like
          a mountain compared to everyone else's molehills. They have reached 11-0 in over a third
          of those seasons and 12-0 in almost one out of every five. And, as a quirk of typically
          only playing 13 games and having done quite well in postseason contests, they actually see
          a bump from 13 to 14 games.
        </Paragraph>

        <LosslessRecordLineGraph seriesData={alabamaFirstLossSeriesData_2007_2017}>
          <LosslessRecordLineGraphSeasons>
            <b>Alabama:</b> 2007 - 2017
          </LosslessRecordLineGraphSeasons>
        </LosslessRecordLineGraph>

        <Caption>
          Alabama under Nick Saban has been extremely consistent, often making it deep into the
          season before losing its first game.
        </Caption>

        <Paragraph>
          Since it is a bit difficult to compare all these charts on their own, let's put everything
          together into a single chart.
        </Paragraph>

        <LosslessRecordLineGraph
          seriesData={[
            ...ndFirstLossSeriesData_1887_2017,
            ...ndFirstLossSeriesData_1990_2017,
            ...ndFirstLossSeriesData_2010_2017,
            ...ndFirstLossSeriesData_1943_1949,
            ...alabamaFirstLossSeriesData_2007_2017,
            ...allFirstLossSeriesData_1917_2017,
          ]}
          showArea={false}
          showLineLabels={false}
        >
          <Legend>
            <div>
              <Color $hex="#2a8c5f" />
              <span>ND [1887-2017]</span>
            </div>
            <div>
              <Color $hex="#377eb8" />
              <span>ND [1990-2017]</span>
            </div>
            <div>
              <Color $hex="#984ea3" />
              <span>ND [2010-17]</span>
            </div>
            <div>
              <Color $hex="#ff7f00" />
              <span>ND [1943-49]</span>
            </div>
            <div>
              <Color $hex="#b50321" />
              <span>Alabama [2007-17]</span>
            </div>
            <div>
              <Color $hex="#19dabf" />
              <span>All [1917-2017]</span>
            </div>
          </Legend>
        </LosslessRecordLineGraph>

        <Caption>
          The modern Alabama and 1940s Notre Dame dynasties started seasons much stronger than more
          modern Irish teams and all teams in general.
        </Caption>

        <Paragraph>
          As dominant as modern-day Alabama is, the Notre Dame dynasty from 1943-49 was even more
          so, at least on this metric. Meanwhile, Notre Dame teams since 1990 trend just a few
          percentage points above the all team average. Under Brian Kelly, the Irish's numbers look
          generally healthier, although they were certainly buoyed by the great 2012 season. After
          factoring in whenever the Irish first fall this season &mdash; if they do at all &mdash;
          his numbers will look even better.
        </Paragraph>

        <SectionTitle>When Teams Do Not Lose</SectionTitle>

        <Paragraph>
          Enough talk about losses; let's look at those teams which never lost. Dating back to 1869
          &mdash; the first season of intercollegiate football in the United States &mdash; 431
          teams have gone undefeated, spread across 109 unique schools. Nearly a third of those 149
          football seasons ended with four or more undefeated teams, including two seasons &mdash;
          1910 and 1920 &mdash; which saw a record ten undefeated teams.
        </Paragraph>

        <Table
          headers={['Undefeated Teams', 'Seasons', 'Latest']}
          rows={undefeatedTeamCountsPerSeasonTableData}
        />

        <Caption>
          A large majority of seasons have ended with anywhere from zero to three undefeated teams.
        </Caption>

        <Note>
          An undefeated season is considered any season, regardless of length, in which a team did
          not have a single loss, even if that team had one or more ties.
        </Note>

        <Paragraph>
          It has been 46 years since a season ended with four or more undefeated teams. That
          particular 1973 season was noteworthy for Notre Dame as they claimed a National
          Championship with a{' '}
          <StyledExternalLink href="/1973/11/">
            24-23 Sugar Bowl win over then-#1 Alabama
          </StyledExternalLink>{' '}
          in the first matchup between those two teams.
        </Paragraph>

        <PerSeasonBarChart
          data={undefeatedTeamCountsPerSeasonBarChartData}
          xAxisLabel="Season"
          yAxisLabel="Undefeated Teams"
          margins={{left: 60, sm: {left: 48}}}
        />

        <Caption>
          Ending the season with four or more undefeated teams seems impossible in the modern game,
          but it was quite common during the early years of the sport.
        </Caption>

        <Paragraph>
          Every season from 1872 to 1941 ended with at least one undefeated team, many of them with
          many more. Meanwhile, since just the turn of the millenium, six seasons have ended with
          every team losing at least once. Increased parity, longer regular seasons, and the
          proliferation of the modern-day bowl and playoff system make it unlikely for there to be
          more than three undefeated teams any time soon.
        </Paragraph>

        <Paragraph>
          A few unexpected schools claim a disproportionate number of undefeated seasons. Three Ivy
          League institutions who no longer even play in the top division of college football round
          out the top five with the perennial and seemingly resurgent powerhouses of Notre Dame and
          Michigan.
        </Paragraph>

        <Table
          headers={['Team Name', 'Undefeated Seasons Since 1869', 'Latest']}
          rows={undefeatedSeasonCountsPerTeamTableData_1869_2017}
          highlightedRowIndexes={[2]}
        />

        <Caption>
          There are some surprising names on the list of schools with the most undefeated seasons.
        </Caption>

        <Note>
          Only seasons during which a school played in the top division of college football are
          included. For example, Harvard went undefeated in 2014, but since it now plays in the
          Football Championship Subdivision, it is not counted.
        </Note>

        <Paragraph>
          The table above may be accurate according to the official records, but it does not take
          into account that Princeton, Yale, Harvard, and even Notre Dame are some of the oldest
          football programs and went lossless in seasons in which they only played a handful of
          games. In fact, in Princeton's first six undefeated seasons, it played a total of just 10
          games, fewer than modern teams play in a single season. If we take a more recent snapshot,
          say the last 100 years of college football, a familiar name leads the pack.
        </Paragraph>

        <Table
          headers={['Team Name', 'Undefeated Seasons Since 1917', 'Latest']}
          rows={undefeatedSeasonCountsPerTeamTableData_1917_2017}
          highlightedRowIndexes={[0]}
        />

        <Caption>
          Notre Dame has had more undefeated seasons than any other school over the past century.
        </Caption>

        <SectionTitle>Chasing Undefeated Season Number 24</SectionTitle>

        <Paragraph>
          Notre Dame sits at 9-0, five wins away from the school's 24th undefeated season. It would
          be its first since they last{' '}
          <StyledExternalLink href="/1988/">won a National Championship in 1988</StyledExternalLink>
          . But, as we saw above, even making it to this point in the season without a loss puts the
          Irish in rare company. In fact, the Irish have started this season with as many wins as
          they finished with in all but a handful of their all-time undefeated seasons.
        </Paragraph>

        <Table
          headers={['Season', 'Games Played', 'Record']}
          rows={ndUndefeatedSeasonTableData}
          highlightedRowIndexes={[11, 13, 18, 21, 22]}
        />

        <Caption>
          Notre Dame's win count at this point in the 2018 season is already as high as it was in
          all but five of its 23 all-time undefeated seasons.
        </Caption>

        <Paragraph>
          The next obstacle in Notre Dame's path to an undefeated season is a senior day{' '}
          <StyledExternalLink href="/2018/10/">
            home game against a 4-5 Florida State
          </StyledExternalLink>{' '}
          who has a solitary win outside Tallahassee this season, a 28-24 victory over an equally
          terrible Louisville team. History is on the line as the Irish continue their chase for
          perfection.
        </Paragraph>

        <Divider />

        <NewsletterSignupForm />
      </Wrapper>
    );
  }
}
