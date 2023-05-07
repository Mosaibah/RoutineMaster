// components/CountdownPieChart.js

import { useEffect, useState } from 'react';
import Countdown from 'react-countdown';
import { PieChart } from 'react-minimal-pie-chart';

const CountdownPieChart = ({ duration }) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setElapsedTime((elapsed) => elapsed + 1000);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const percentage = 100 - (elapsedTime / duration) * 100;

  return (
    <div className="flex flex-col items-center">
      <PieChart
        data={[
          { title: 'Remaining Time', value: percentage, color: '#10B981' },
          { title: 'Elapsed Time', value: 100 - percentage, color: '#E5E7EB' },
        ]}
        lineWidth={20}
        rounded
        style={{ height: '200px' }}
      />
      <Countdown
        date={Date.now() + duration - elapsedTime}
        renderer={({ hours, minutes, seconds, completed }) => (
          <span className="mt-4 text-lg font-semibold">
            {hours}:{minutes}:{seconds}
          </span>
        )}
      />
    </div>
  );
};

export default CountdownPieChart;