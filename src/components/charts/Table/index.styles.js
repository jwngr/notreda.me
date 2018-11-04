import {darken} from 'polished';
import styled from 'styled-components';

import backgroundImage from '../../../images/background.png';

export const TableWrapper = styled.div`
  margin: 20px auto;
  overflow: scroll;
  font-family: 'Inter UI', serif;
  display: inline;

  table {
    margin: auto;
    max-width: 100%;
    color: ${(props) => darken(0.2, props.theme.colors.green)};
    border-collapse: collapse;
    background-image: url(${backgroundImage});
    border: solid 3px ${(props) => darken(0.2, props.theme.colors.green)};

    th,
    td {
      font-size: 14px;
      padding: 8px 12px;
      text-align: center;

      @media (max-width: 700px) {
        font-size: 12px;
        padding: 4px;
      }
    }

    th {
      font-weight: bold;
      color: ${(props) => props.theme.colors.white};
      background-color: ${(props) => props.theme.colors.green}cc;
    }

    tr {
      background-color: ${(props) => props.theme.colors.gray}40;
    }

    tr:nth-of-type(2n) {
      background-color: ${(props) => props.theme.colors.lightGray}40;
    }

    tr.highlighted {
      background-color: ${(props) => props.theme.colors.gold}b0;
    }

    a {
      text-decoration: none;
      color: ${(props) => props.theme.colors.green};
    }
  }
`;
