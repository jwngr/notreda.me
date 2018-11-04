import React from 'react';

import LineChart from '../../../../charts/LineChart';

export default ({children, seriesData}) => {
  return (
    <LineChart
      seriesData={seriesData}
      xAxisLabel="Record"
      yAxisLabel="% Seasons With Record"
      formatXAxisTickLabels={(x) => `${x}-0`}
      formatYAxisTickLabels={(x) => `${x}%`}
      domainY={[0, 100]}
      showLine={true}
    >
      {children}
    </LineChart>
  );
};
