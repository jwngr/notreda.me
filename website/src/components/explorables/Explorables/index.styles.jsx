import {darken} from 'polished';
import styled from 'styled-components';

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

export const Subtitle = styled.p`
  text-align: center;
  margin: 8px auto;
  font-size: 24px;
  max-width: ${(props) => props.maxWidth || '440px'};
  font-family: 'Bungee';
  color: ${({theme}) => theme.colors.black};
`;

export const Divider = styled.div`
  border-top: solid 3px ${({theme}) => darken(0.2, theme.colors.green)};
  margin: 20px auto;
  &::after {
    content: '';
  }
`;

export const BlogPostCardWrapper = styled.div`
  a {
    font-family: 'Inter UI';
    font-size: 20px;
    color: ${({theme}) => theme.colors.green};
    text-decoration: none;
    font-weight: bold;

    @media (max-width: 600px) {
      font-size: 24px;
    }
  }

  a:hover {
    text-decoration: underline;
  }
`;

export const BlogPostDate = styled.p`
  font-size: 16px;
  font-family: 'Inter UI';
  margin: 12px 0;
  color: ${({theme}) => theme.colors.gray};
`;

export const BlogPostDescription = styled.p`
  font-size: 16px;
  font-family: 'Inter UI';
  line-height: 1.5;
  color: ${({theme}) => theme.colors.black};
`;
