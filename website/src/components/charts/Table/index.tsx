import React from 'react';

import {TableRow, TableWrapper} from './index.styles';

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
      <TableRow key={`tr-${i}`} $isHighlighted={highlightedRowIndexes.includes(i)}>
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
