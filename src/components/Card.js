import React from 'react';
import TaskCard from '../components/TaskCard'

const Card = ({ title, tasks, onSelect }) => {
    const totalTasks = tasks.length;
    const totalTime = tasks.reduce((acc, task) => acc + task.duration, 0);
  
    return (
      <div className="bg-white shadow-xl rounded p-6 w-full border-2 border-gray-400">
        <div className="flex justify-between items-center mb-4">
        <span className="text-md font-bold ">{title}</span>
          <span>Tasks: {totalTasks}</span>
          <span>{totalTime} min</span>
        </div>
        <div className="grid grid-cols-1 gap-4 mb-4">
          {tasks.map((task, index) => (
            <TaskCard key={index} task={task} />
          ))}
        </div>
        <div className='flex flex-col justify-center'>
            <button
            className=" text-green-600 py-2 px-4 rounded-md font-medium border-2 border-green-600"
            onClick={onSelect}
            >
            Select
            </button>
        </div>
      </div>
    );
  };
  
  export default Card;