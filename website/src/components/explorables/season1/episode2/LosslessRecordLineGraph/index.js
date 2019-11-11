import React from 'react';

import LineChart from '../../../../charts/LineChart';

export default ({children, ...otherProps}) => {
  return (
    <LineChart
      {...otherProps}
      xAxisLabel="Games Won Or Tied Before First Loss"
      yAxisLabel="Percentage of Seasons"
      formatYAxisTickLabels={(x) => `${x}%`}
      domainY={[0, 100]}
      showLine={true}
    >
      {children}
    </LineChart>
  );
};
