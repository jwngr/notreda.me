import React from 'react';

import {LineChart} from '../../../charts/LineChart';
import {FirstLossSeriesData} from './models';

export const LosslessRecordLineGraph: React.FC<{
  readonly children: React.ReactNode;
  readonly seriesData: readonly FirstLossSeriesData[];
  readonly showArea?: boolean;
  readonly showLineLabels?: boolean;
}> = ({children, seriesData, showArea, showLineLabels}) => {
  return (
    <LineChart
      seriesData={seriesData}
      xAxisLabel="Games Won Or Tied Before First Loss"
      yAxisLabel="Percentage of Seasons"
      formatYAxisTickLabels={(x: number) => `${x}%`}
      domainY={[0, 100]}
      showLine={true}
      showArea={showArea}
      showLineLabels={showLineLabels}
    >
      {children}
    </LineChart>
  );
};
