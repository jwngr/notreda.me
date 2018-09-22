import styled from 'styled-components';

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
  border: solid 3px #302205;
  padding: 0 0 12px 12px;
  background: #dcdcdc;
  overflow-y: scroll;

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
