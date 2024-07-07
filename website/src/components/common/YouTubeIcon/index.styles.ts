import styled from 'styled-components';

export const YouTubeIconSvg = styled.svg`
  cursor: pointer;
  width: 40px;
  margin-top: 16px;

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
