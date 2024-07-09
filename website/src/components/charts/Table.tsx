import {darken} from 'polished';
import React from 'react';
import styled from 'styled-components';

import backgroundImage from '../../images/background.png';

const TableWrapper = styled.div`
  margin: 20px auto;
  overflow: scroll;
  font-family: 'Inter UI', serif;
  display: inline;

  table {
    margin: auto;
    max-width: 100%;
    min-width: 400px;
    color: ${({theme}) => darken(0.2, theme.colors.green)};
    border-collapse: collapse;
    background-image: url(${backgroundImage});
    border: solid 3px ${({theme}) => darken(0.2, theme.colors.green)};

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
      font-variant: small-caps;
      color: ${({theme}) => theme.colors.white};
      background-color: ${({theme}) => theme.colors.green}cc;
    }

    a {
      text-decoration: none;
      color: ${({theme}) => theme.colors.green};
    }
  }

  @media (max-width: 700px) {
    table {
      min-width: 100%;
    }
  }
`;

interface TableRowProps {
  readonly $isOdd: boolean;
  readonly $isHighlighted: boolean;
}

const TableRow = styled.tr<TableRowProps>`
  background-color: ${({theme, $isOdd, $isHighlighted}) =>
    $isHighlighted
      ? `${theme.colors.gold}b0`
      : $isOdd
        ? `${theme.colors.gray}40`
        : `${theme.colors.lightGray}40`};
`;

export const Table: React.FC<{
  readonly headers: (string | {readonly text: string; readonly width: string})[];
  readonly rows: string[][];
  readonly highlightedRowIndexes?: number[];
}> = ({headers, rows, highlightedRowIndexes = []}) => {
  const headerRow = (
    <tr key="header">
      {headers.map((header, i) => {
        if (typeof header === 'string') {
          return <th key={`th-${i}`}>{header}</th>;
        } else {
          return (
            <th key={`th-${i}`} style={{width: header.width}}>
              {header.text}
            </th>
          );
        }
      })}
    </tr>
  );

  const dataRows = rows.map((row, i) => {
    return (
      <TableRow
        key={`tr-${i}`}
        $isOdd={i % 2 !== 0}
        $isHighlighted={highlightedRowIndexes.includes(i)}
      >
        {row.map((item, j) => (
          <td key={`td-${i}-${j}`}>{item}</td>
        ))}
      </TableRow>
    );
  });

  return (
    <TableWrapper>
      <table>
        <tbody>
          {headerRow}
          {dataRows}
        </tbody>
      </table>
    </TableWrapper>
  );
};
