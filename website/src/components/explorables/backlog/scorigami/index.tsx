import React from 'react';
import {Helmet} from 'react-helmet';

import {NewsletterSignupForm} from '../../../common/NewsletterSignupForm';
import {
  Byline,
  Divider,
  Heading,
  Paragraph,
  StyledExternalLink,
  Subtitle,
  Title,
  Wrapper,
} from '../../index.styles';
import {ScorigamiChart} from './ScorigamiChart';

const title = 'Scorigami';

export const Scorigami: React.FC = () => {
  return (
    <Wrapper>
      <Helmet>
        <title>{`${title} | notreda.me`}</title>
      </Helmet>

      <Heading>
        <p>Explorables</p>
        <p>Season 1, Episode ???</p>
      </Heading>

      <Title>{title}</Title>

      <Subtitle>Game Scores Charted</Subtitle>

      <Byline>
        <p>September ???, 2018</p>
        <StyledExternalLink href="https://jwn.gr">Jacob Wenger</StyledExternalLink>
      </Byline>

      <Paragraph>Scorigami chart:</Paragraph>

      <ScorigamiChart />

      <Divider />

      <NewsletterSignupForm />
    </Wrapper>
  );
};
