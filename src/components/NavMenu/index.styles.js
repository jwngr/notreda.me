import styled from 'styled-components';

import backgroundImage from '../../images/background.png';

export const NavMenuWrapper = styled.div`
  position: fixed;
  width: 720px;
  max-width: 100%;
  height: 100%;
  top: 0;
  right: 0;
  visibility: hidden;
  transform: translateX(600px);
  transition: transform 0.5s, visibility 0s 0.5s;
  overflow: scroll;
  z-index: 10;
  padding: 0 0 12px 12px;
  overflow-y: scroll;
  border: solid 3px ${(props) => props.theme.colors.black};
  background-color: ${(props) => props.theme.colors.lightGray};
  background-image: url(${backgroundImage});
  overscroll-behavior: contain;

  &.open {
    visibility: visible;
    transform: translateX(0px);
    transition: transform 0.5s;
  }
`;

export const NavMenuDecadesWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
