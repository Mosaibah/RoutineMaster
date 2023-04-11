import React from 'react';

const TaskCard = ({ task }) => {
  return (
    <div className="bg-gray-100 p-3 rounded flex justify-between px-3">
      <span className="text-md font-semibold mb-1">{task.name}</span>
      <span> {task.duration} min</span>
    </div>
  );
};

export default TaskCard;