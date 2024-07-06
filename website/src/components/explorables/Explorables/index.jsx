import React from 'react';
import {Helmet} from 'react-helmet';

import {InternalLink} from '../../common/InternalLink2';
import {NewsletterSignupForm} from '../../common/NewsletterSignupForm';
import {
  BlogPostCardWrapper,
  BlogPostDate,
  BlogPostDescription,
  Divider,
  Subtitle,
  Title,
  Wrapper,
} from './index.styles';

const posts = [
  {
    slug: 's1e1-down-to-the-wire',
    title: 'Down To The Wire',
    subtitle: 'One Possession Games In The Brian Kelly Era',
    date: 'September 27, 2018',
    description:
      'Life as a Notre Dame football fan can be stressful. But is it any more stressful than being a fan of another college football team? The amount of one possession games the Irish have played under Brian Kelly suggests it is.',
  },
  {
    slug: 's1e2-chasing-perfection',
    title: 'Chasing Perfection',
    subtitle: 'When Teams Stumble En Route To Undefeated Seasons',
    date: 'November 7, 2018',
    description:
      'Winning is hard; going undefeated, harder still. Take a stroll through the Notre Dame and NCAA history books to see how rare it is for the Irish to be sitting with an undefeated 9-0 record at this point in the season.',
  },
];

const BlogPostCard = ({slug, date, title, subtitle, description}) => (
  <BlogPostCardWrapper>
    <InternalLink to={`/explorables/${slug}`}>
      {title}: {subtitle}
    </InternalLink>
    <BlogPostDate>{date}</BlogPostDate>
    <BlogPostDescription>{description}</BlogPostDescription>
  </BlogPostCardWrapper>
);

export const Explorables = () => (
  <React.Fragment>
    <Helmet>
      <title>Explorables | notreda.me</title>
    </Helmet>

    <Wrapper>
      <Title>Explorables</Title>
      <Subtitle>Interactive blog posts on Fighting Irish football</Subtitle>

      <Divider />
      {posts.map((postInfo) => (
        <React.Fragment key={postInfo.slug}>
          <BlogPostCard {...postInfo} />
          <Divider />
        </React.Fragment>
      ))}

      <NewsletterSignupForm />
    </Wrapper>
  </React.Fragment>
);
