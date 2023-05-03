import React from "react";
import { useRouter } from "next/router";
import { VictoryPie, VictoryLabel } from "victory";
import Link from "next/link";

const ClickablePieChart = ({ tasks }) => {
  const router = useRouter();

  const handleClick = (event, id) => {
    router.push(`/task/${id}`);
  };

  console.log("tasks", tasks);
  return (
    <>
      <h1 className="text-xl font-bold mb-4">Tasks</h1>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Duration</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tasks.map((task) => (
            <tr key={task.id}>
              <Link href={`/history/${task.id}`} className="underline">
                <td className="px-4 py-2">{task.id}</td>
              </Link>
              <td className="px-4 py-2">{task.name}</td>
              <td className="px-4 py-2">{task.duration}</td>
              <td className="px-4 py-2">{task.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
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
              target: "data",
              eventHandlers: {
                onClick: (event, { datum }) => {
                  handleClick(event, datum.id);
                },
              },
            },
          ]}
        />
      </svg>
    </>
  );
};

export default ClickablePieChart;
