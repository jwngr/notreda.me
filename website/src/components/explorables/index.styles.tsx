import {darken} from 'polished';
import React from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components';

import backgroundImage from '../../images/background.png';

export const Wrapper = styled.div`
  max-width: 740px;
  padding: 4px 20px;
  margin: 20px auto;
  border: solid 3px ${({theme}) => darken(0.2, theme.colors.green)};
  background-color: ${({theme}) => theme.colors.gold}66;

  @media (max-width: 600px) {
    padding: 2px 16px;
    margin: 0;
    border: none;
  }
`;

export const Heading = styled.div`
  margin: 20px auto 8px auto;
  text-align: center;
  font-size: 16px;
  font-family: 'Bungee';
  color: ${({theme}) => theme.colors.gray};

  a {
    text-decoration: none;
    color: ${({theme}) => theme.colors.gray};
  }
`;

export const Title = styled.h1`
  margin: 8px auto;
  text-align: center;
  font-size: 44px;
  font-weight: bold;
  font-family: 'Bungee';
  color: ${({theme}) => theme.colors.green};
  -webkit-text-stroke: 1px; /* TODO: cross-browser solution */
  -webkit-text-stroke-color: ${({theme}) => darken(0.2, theme.colors.green)};
  text-shadow: ${({theme}) => theme.colors.black} 2px 2px;
`;

interface SubtitleProps {
  readonly maxWidth?: string;
}

export const Subtitle = styled.p<SubtitleProps>`
  text-align: center;
  margin: 8px auto;
  font-size: 24px;
  font-variant: small-caps;
  max-width: ${({maxWidth}) => maxWidth || '440px'};
  font-family: 'Bungee';
  color: ${({theme}) => theme.colors.black};
`;

export const Byline = styled.div`
  text-align: center;
  margin: 12px auto 20px auto;
  font-size: 16px;
  font-family: 'Inter UI';
  color: ${({theme}) => theme.colors.gray};

  p {
    margin-bottom: 4px;
  }
`;

export const SectionTitle = styled.h2`
  margin: 20px auto;
  font-size: 28px;
  font-weight: bold;
  font-family: 'Inter UI';
  color: ${({theme}) => theme.colors.green};
`;

export const Paragraph = styled.p`
  margin: 20px auto;
  font-size: 16px;
  line-height: 1.5;
  font-family: 'Inter UI';
  text-align: justify;
  word-break: break-word;
  color: ${({theme}) => theme.colors.black};
`;

export const Image = styled.img`
  width: 100%;
  display: block;
  margin: 20px auto 8px auto;
  border: solid 3px ${({theme}) => theme.colors.black};
`;

export const Caption = styled.p`
  font-size: 14px;
  text-align: justify;
  margin: 8px auto 20px auto;
  font-family: 'Inter UI';
  word-break: break-word;
  color: ${({theme}) => theme.colors.gray};
`;

export const StatsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  margin: -10px 0;

  @media (max-width: 600px) {
    justify-content: center;
  }
`;

export const Stat = styled.div`
  display: flex;
  font-family: 'Inter UI', sans-serif;
  flex-direction: column;
  width: calc(50% - 12px);
  margin: 10px 0;
  text-align: center;
  background-image: url(${backgroundImage});
  background-color: ${({theme}) => theme.colors.gray}40;
  border: solid 3px ${({theme}) => darken(0.2, theme.colors.green)};

  p:first-of-type {
    padding: 12px;
    font-size: 18px;
    font-weight: bold;
    font-variant: small-caps;
    color: ${({theme}) => theme.colors.white};
    background-color: ${({theme}) => theme.colors.green};
    border-bottom: solid 3px ${({theme}) => darken(0.2, theme.colors.green)};
  }

  p:last-of-type {
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
    padding: 8px;
    font-size: 30px;
    font-weight: bold;
    color: ${({theme}) => theme.colors.green};
  }

  a {
    max-width: 90%;
    font-size: 28px;
    margin: 12px auto 4px auto;
  }

  @media (max-width: 600px) {
    width: 100%;
  }
`;

export const StyledExternalLink = styled.a`
  color: ${({theme}) => theme.colors.green};

  &:hover {
    color: ${({theme}) => darken(0.1, theme.colors.green)};
  }
`;

export const StyledInternalLink = styled(Link)`
  color: ${({theme}) => theme.colors.green};

  &:hover {
    color: ${({theme}) => darken(0.1, theme.colors.green)};
  }
`;

export const Divider = styled.div`
  border-top: solid 3px ${({theme}) => darken(0.2, theme.colors.green)};
  margin: 20px auto;
  &::after {
    content: '';
  }
`;

// TODO: Move to a separate file and rename this file to `.ts`.
export const Note: React.FC<{
  readonly children: React.ReactNode;
}> = ({children}) => {
  return (
    <Paragraph>
      <i>
        <b>Note:</b> {children}
      </i>
    </Paragraph>
  );
};
