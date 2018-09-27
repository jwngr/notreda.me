import _ from 'lodash';
import React from 'react';
import {Helmet} from 'react-helmet';

import Table from '../../../charts/Table';
import BarChart from '../../../charts/BarChart';
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
  StyledInternalLink,
} from '../../index.styles';

import data from './data.json';
import schedule2016Image from '../../../../images/explorables/season1/episode1/schedule2016.png';

const title = 'Down To The Wire';

export default () => {
  return (
    <Wrapper>
      <Helmet>
        <title>{`${title} | notreda.me`}</title>
      </Helmet>

      <Heading>
        <p>Explorables</p>
        <p>Season 1, Episode 1</p>
      </Heading>

      <Title>{title}</Title>

      <Subtitle>One Possession Games In The Brian Kelly Era</Subtitle>

      <Byline>
        <p>September 27, 2018</p>
        <StyledExternalLink href="https://jwn.gr">Jacob Wenger</StyledExternalLink>
      </Byline>

      <P>
        Life as a Notre Dame football fan can be stressful. It sometimes feels like we are in a
        heated contest each and every weekend, this past weekend's{' '}
        <StyledInternalLink href="/2018/4">blowout victory over Wake Forest</StyledInternalLink>{' '}
        being the exception, not the norm. But is that just life as a college football fan where
        anything that can go sideways eventually does? Despite Notre Dame's undefeated record so far
        this season, a common criticism of the Brian Kelly era is still making the rounds: his team
        plays in too many close games, often playing down to the level of inferior opponents.
      </P>

      <P>
        Look no further back than the{' '}
        <StyledInternalLink href="/2016">2016 season</StyledInternalLink> for how this can go
        terribly wrong. Despite finishing with an overall season point differential of +37, the
        Irish managed just a 4-8 record and it felt like Kelly was on the verge of losing his job.
        While a lot went wrong that season, an abysmal 1-7 record in one possession games - defined
        as those whose final score is within 8 or fewer points - is largely to blame.
      </P>

      {/* TODO: update image b/c invalid date */}
      <Image src={schedule2016Image} alt="Notre Dame Football 2016 season results" />

      <Caption>
        Notre Dame's 4-8 record in 2016 was largely thanks to a 1-7 record in one possession games.
      </Caption>

      <P>
        While this year's team is touting a much improved 3-0 record in such games, including an{' '}
        <StyledInternalLink href="/2018/1">opening weekend victory</StyledInternalLink> against a
        currently 14th ranked Michigan, the offense looked anemic in nail-biter victories over{' '}
        <StyledInternalLink href="/2018/2">Ball State</StyledInternalLink> and{' '}
        <StyledInternalLink href="/2018/3">Vanderbilt</StyledInternalLink>, two opponents who won't
        even sniff the top 25 this year. In close games like those, a stroke of bad luck or a single
        missed tackle could turn a close win into a painful loss. And even when they do hold on to
        win, it is hard to quantify the impact it has on the team over the course of the season.
        Increased wear and tear on starters - or, worse yet, injuries at the tail end of a game -
        may have been avoided if they were watching from the bench during the fourth quarter because
        they took care of business in the first three.
      </P>

      <P>
        Everyone seems to have their own reason for hating on Kelly. But is this particular
        criticism of his coaching actually fair?
      </P>

      <SectionTitle>One Possession Games In The BK Era</SectionTitle>

      <P>
        Let's start by quantifying the amount of one possession games Notre Dame has actually played
        with Kelly at the helm. Heading into this weekend's top 10 contest against Stanford in
        Kelly's ninth seasons, he has accrued an overall record of 73-34, good for a win percentage
        of 68.2%. Note that this figure includes Notre Dame's vacated wins from the 2012-13 seasons
        since they are just as relevant in this analysis. Of those 107 games in the BK era, 49 have
        been been decided by 8 or fewer points, an anxiety-inducing 45.8% of all games. 2016
        certainly had the most, but outside of 2017, one possession games are a consistent trend for
        Kelly.
      </P>

      <BarChart
        data={data.nd.brianKellyEra.onePossessionGameCounts}
        xAxisLabel="Year"
        yAxisLabel="One Possession Games"
        xAxisTickLabels={['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018']}
        margins={{left: 60, sm: {left: 48}}}
      />

      <Caption>
        Count of games in each season under Brian Kelly which were decided by a single possession.
      </Caption>

      <P>
        It almost seems obvious to say that it takes just one play to change the outcome of a one
        possession game. In fact, there are almost too many such plays to choose from in the BK era:{' '}
        <StyledExternalLink href="https://www.youtube.com/watch?v=y0htsUV9L3o">
          the deep bomb
        </StyledExternalLink>{' '}
        to Will Fuller for a win over Virginia,{' '}
        <StyledExternalLink href="https://www.youtube.com/watch?v=u5t-t_bZY_Q">
          the untimely fumble
        </StyledExternalLink>{' '}
        by Cam McDaniel while running out the clock against Northwestern,{' '}
        <StyledExternalLink href="https://www.youtube.com/watch?v=mqfIcVzeOQM">
          the infamous "pick play"
        </StyledExternalLink>{' '}
        in a heartbreaking loss to Florida State,{' '}
        <StyledExternalLink href="https://www.youtube.com/watch?v=mv7s2UAwdao">
          the wild overtime affair
        </StyledExternalLink>{' '}
        against Pitt . Given the sheer craziness of college football, it is unsurprising that
        Kelly's win percentage in such contests is only 57.1%, a full 11.1% worse than his overall
        win percentage.
      </P>

      <StatsWrapper>
        <Stat>
          <p>Overall Win %</p>
          <p>68.2%</p>
        </Stat>
        <Stat>
          <p>Win % In One Possession Games</p>
          <p>57.1%</p>
        </Stat>
      </StatsWrapper>

      <P>
        If you ignore the 2016 seasons, Kelly actually has a more respectable 65.9% win percentage
        in one possession games. But as much as us Irish fans would like to wipe that year from our
        collective memories, we all saw that and are not going to let Kelly off so lightly for it.
      </P>

      <BarChart
        data={data.nd.brianKellyEra.onePossesssionGameWinPercentages}
        yMax={100}
        xAxisLabel="Year"
        formatCount={(d) => `${d}%`}
        yAxisLabel="Win % In One Possession Games"
        xAxisTickLabels={['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018']}
      />

      <Caption>Brian Kelly's yearly win percentage in one possession games.</Caption>

      <P>
        These figures appear to provide some support for this criticism of Kelly, but we really need
        to compare them in a broader context.
      </P>

      <SectionTitle>Comparing BK To Past Irish Head Coaches</SectionTitle>

      <P>
        The first place to look is to compare how Kelly stacks up against the other men who have
        held the same position as Notre Dame head coach. Over the course of the history of Notre
        Dame football, 22 men have coached the Irish in ten or more games. Here is what they look
        like ranked according to what percentage of those games were decided by one possession.
      </P>

      <Table
        headers={[
          'Head Coach',
          'Years Coached',
          'National Titles',
          'Games Coached',
          '% One Possession Games',
        ]}
        rows={data.coaches.rows}
        highlightedRowIndexes={[18]}
      />

      <Caption>
        Brian Kelly plays in a lot more one possession games than the Irish head coaching legends.
      </Caption>

      <P>
        <i>
          <b>Note:</b> Although the two point conversion was adopted by college football in 1958, an
          8 point differential was used for all calculations above. If anything, correcting the
          percentages for older coaches would just make Kelly's number look even worse.
        </i>
      </P>

      <P>
        Kelly ends up on the wrong end of this chart, far from his peers who have brought Notre Dame
        to the promised land of a National Championship and instead stuck in the middle of a who's
        who of coaching failures at Notre Dame in the past few decades. And before you say your
        thanks for him being better than Ty, I'd like to point out that Willingham sported a hefty
        13-6 record (68.4%) in one possession games during his tenure. But this is due to the Irish
        sneaking out lots of close games against inferior opponents while getting clobbered en route
        to an 8-9 record in all other contests.
      </P>

      <P>
        The table above seems to be another indication that there is something behind this line of
        criticism of Kelly, but maybe it is unfair to compare this metric over time. After all, the
        game evolves and maybe there are more close games now than there used to be, maybe due to
        parity across teams. So let's take a look at Kelly's contemporaries.
      </P>

      <SectionTitle>Comparing BK To Other Top 25 Teams</SectionTitle>

      <P>
        To get an idea of how Kelly's numbers compare to other coaches, let's analyze every team who
        has finished in the top 25 during Kelly's tenure, all the way back to the final rankings in
        2010 and including the current top 25 from this week (welcome to the party Kentucky!). That
        list contains 71 teams, but let's first just look at the top 15 sorted in ascending order of
        the percentage of games they have played over the past nine seasons which were decided by
        just one possession:
      </P>

      <Table
        headers={['Team', 'Top 25 Finishes', 'National Titles', '% One Poss Games']}
        rows={_.take(data.top25.rows, 15)}
      />

      <Caption>
        The top 15 teams who have played in the fewest percentage of one possession games during the
        Brian Kelly at Notre Dame era.
      </Caption>

      <P>
        No one who follows college football will be surprised to see Alabama at the top of this
        list. They have four National Championships over this period - as many as all other teams
        combined - as their reward. But there are some surprises, such as Western Michigan and
        Southern Mississippi, who make this list despite having only a single top 25 finish each.
        Taking Southern Mississippi as an example, their low percentage is due in large part to only
        playing in a handful of one possession games during an awful stretch spanning the 2012-14
        seasons in which they went a combined 4-32. Their inclusion shows that this metric is by no
        means the perfect way to measure good versus bad teams. You can play a low percentage of one
        possession games and still have little success as a program because you consistently lose by
        large margins. But make no mistake, teams like Oregon, Alabama, and Boise State sit atop
        this list because they are consistently beating teams by large margins, not because they are
        getting blown out.
      </P>

      <P>
        But where does Notre Dame fit into this table? Let's expand it to include all 71 of the top
        25 teams from the past nine years and get scrolling.
      </P>

      <Table
        headers={['Team', 'Top 25 Finishes', 'National Titles', '% One Poss Games']}
        rows={data.top25.rows}
        highlightedRowIndexes={[70]}
      />

      <Caption>
        The full list of 71 top 25 teams, sorted by which teams have played in the fewest percentage
        of one possession games during the Brian Kelly at Notre Dame era.
      </Caption>

      <P>
        Dead. Last. 71 out of 71. Notre Dame has played in a higher percentage of one possession
        games than any other top 25 teams over the past nine seasons. No wonder life has felt so
        stressful! Over the course of a single season, Notre Dame plays in an average over 3 more
        one possession games than the Crimson Tide. As with Southern Mississippi, this stat can be a
        bit misleading. Many teams in this list would likely trade places with the varied success
        Notre Dame has under Kelly. But this certainly feels like yet another piece of evidence that
        Kelly plays in more than his fair share of one possession games.
      </P>

      <SectionTitle>Too Close For Comfort</SectionTitle>

      <P>
        These numbers do not prove that Brian Kelly is a bad coach and they only tangentially even
        touch on Notre Dame's wins and losses under his leadership. But they do lay out some
        compelling evidence that the criticisms against him regarding playing down to opponents have
        some statistical backing. It is plain to see that when looking at how many one possession
        games his team has played in, Kelly is nowhere near his top head coaching contemporaries nor
        his Notre Dame head coaching predecessors.
      </P>

      <P>
        Playing in close games means you're always in it, but it also means the same thing for the
        other team. Play in too many and some of them are bound to not go your way. And beyond the
        direct effect they have on win percentage, the second order detrimental effects they have on
        starters over the course of a season cannot be discounted. Notre Dame has not done
        especially well these past few Novembers, after all, and this may be one of the many
        contributing factors.
      </P>

      <P>
        Brian Kelly has had his share of success at Notre Dame and the team may just be poised to do
        something special this year. But the amount of one possession games Notre Dame has played in
        during his tenure is a troubling trend that has continued into this season. It's unclear if
        Kelly will vanquish a{' '}
        <StyledInternalLink href="/2018/5">David Shaw-led Stanford team</StyledInternalLink> who has
        had his number these past few years, but it's safe to assume this weekend's matchup will
        once again come down to the final drive.
      </P>

      <Divider />

      <NewsletterSignupForm />
    </Wrapper>
  );
};
