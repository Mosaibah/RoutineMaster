import React from 'react';
import { useRouter } from 'next/router';
import { VictoryPie, VictoryLabel } from 'victory';

const ClickablePieChart = ({ tasks }) => {
  const router = useRouter();

  const handleClick = (event, id) => {
    router.push(`/task/${id}`);
  };

  return (
    <svg viewBox="0 0 400 400">
      <VictoryPie
        standalone={false}
        width={400}
        height={400}
        data={tasks}
        x="name"
        y="duration"
        innerRadius={80}
        labels={({ datum }) => `${datum.name}\n(${datum.duration} min)`}
        labelComponent={<VictoryLabel dy={-5} />}
        events={[
          {
            target: 'data',
            eventHandlers: {
              onClick: (event, { datum }) => {
                handleClick(event, datum.id);
              },
            },
          },
        ]}
      />
    </svg>
  );
};

export default ClickablePieChart;