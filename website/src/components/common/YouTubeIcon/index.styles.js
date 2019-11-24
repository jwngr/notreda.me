import styled from 'styled-components';

export const YouTubeIconSvg = styled.svg`
  cursor: pointer;
  margin: ${({margin}) => margin};
  width: ${({width}) => width};

  .regular {
    fill: ${({theme}) => theme.colors.black};
  }

  .hover {
    fill: none;
  }

  &:hover {
    .regular {
      fill: none;
    }

    .hover {
      fill: ${({theme}) => theme.colors.green};
    }
  }
`;
