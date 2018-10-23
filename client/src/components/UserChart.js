import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveLine } from '@nivo/line';
import format from 'date-fns/format';

const UserChart = ({ data, name }) => {
  const formattedData = [
    {
      id: name,
      data: data.map(d => ({
        x: format(new Date(d.timestamp * 1000), 'MM/DD/YYYY'),
        y: d.result,
      })),
    },
  ];
  return (
    <div style={{ height: 300 }}>
      <ResponsiveLine
        data={formattedData}
        minY="auto"
        maxY="auto"
        axisBottom={{
          orient: 'bottom',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -45,
          legendOffset: 36,
          legendPosition: 'center',
        }}
        axisLeft={{
          orient: 'left',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'minutes',
          legendOffset: -40,
          legendPosition: 'center',
        }}
        margin={{
          top: 20,
          right: 20,
          bottom: 60,
          left: 80,
        }}
      />
    </div>
  );
};

UserChart.propTypes = {
  data: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired,
};

export default UserChart;
