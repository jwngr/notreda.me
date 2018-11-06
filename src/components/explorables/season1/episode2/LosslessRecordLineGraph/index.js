import React from 'react';

import LineChart from '../../../../charts/LineChart';

export default ({children, seriesData}) => {
  return (
    <LineChart
      seriesData={seriesData}
      xAxisLabel="Games Played Before First Loss"
      yAxisLabel="Percentage of Seasons"
      formatYAxisTickLabels={(x) => `${x}%`}
      domainY={[0, 100]}
      showLine={true}
    >
      {children}
    </LineChart>
  );
};
