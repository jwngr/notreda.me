import _ from 'lodash';
import React from 'react';
import {Helmet} from 'react-helmet';

import ScorigamiChart from './ScorigamiChart';
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

import data from './data.json';

const title = 'Scorigami';

export default () => {
  return (
    <Wrapper>
      <Helmet>
        <title>{`${title} | notreda.me`}</title>
      </Helmet>

      <Heading>
        <p>Explorables</p>
        <p>Season 1, Episode TODO</p>
      </Heading>

      <Title>{title}</Title>

      <Subtitle>Game Scores Charted</Subtitle>

      <Byline>
        <p>September TODO, 2018</p>
        <StyledExternalLink href="https://jwn.gr">Jacob Wenger</StyledExternalLink>
      </Byline>

      <P>Scorigami chart:</P>

      <ScorigamiChart />

      <Divider />

      <NewsletterSignupForm />
    </Wrapper>
  );
};
