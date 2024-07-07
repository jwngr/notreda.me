import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import {TableRow, TableWrapper} from './index.styles';

export const Table = ({headers, rows, highlightedRowIndexes = []}) => {
  const headerRow = (
    <tr key="header">
      {headers.map((header, i) => {
        if (typeof header === 'string') {
          return <th key={`th-${i}`}>{header}</th>;
        } else {
          return (
            <th width={header.width} key={`th-${i}`}>
              {header.text}
            </th>
          );
        }
      })}
    </tr>
  );

  const dataRows = rows.map((row, i) => {
    return (
      <TableRow key={`tr-${i}`} $isHighlighted={_.includes(highlightedRowIndexes, i)}>
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

Table.propTypes = {
  rows: PropTypes.array.isRequired,
  headers: PropTypes.array.isRequired,
  highlightedRowIndexes: PropTypes.array,
};
