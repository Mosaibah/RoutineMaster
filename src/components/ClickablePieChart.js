import React from "react";
import { useRouter } from "next/router";
import { VictoryPie, VictoryLabel } from "victory";
import Link from "next/link";

const ClickablePieChart = ({ tasks, taskHistoryId }) => {
  const router = useRouter();

  const handleClick = (event, id) => {
    router.push(`/task/${id}`);
  };

  const clearToday = async () => {
    let update = {
      TasksHistoryId: taskHistoryId,
    };
    try {
      const response = await fetch(
        "https://6i4ntknht5.execute-api.us-east-1.amazonaws.com/staging/clear-today",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(update),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
    } catch (error) {
      console.error("Error updating countdown:", error);
    }
    router.reload()
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
            <th className="px-4 py-2">Remaining</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tasks.map((task) => (
            <tr key={task.id}>
              <td className="px-4 py-2">
                <Link href={`/history/${task.id}`} className="underline">
                  {task.id}
                </Link>
              </td>
              <td className="px-4 py-2">{task.name}</td>
              <td className="px-4 py-2">{task.duration}</td>
              <td className="px-4 py-2">{task.remaining}</td>
              <td className="px-4 py-2">{task.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-auto">
        <button
          className="bg-white hover:bg-gray-100 text-red-700 text-xs font-semibold py-1 px-3 border-2 border-red-700 rounded  mr-2"
          onClick={clearToday}
        >
          Delete Today
        </button>
      </div>
      {/* <svg viewBox="0 0 400 400">
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
      </svg> */}
    </>
  );
};

export default ClickablePieChart;
