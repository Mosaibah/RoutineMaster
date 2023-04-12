'use client'
import React from 'react'
import TaskCard from '../components/TaskCard'
import Button from '../components/Button'

const Card = ({ title, tasks, onSelect , typeOfButton, color}) => {
    const totalTasks = tasks.length;
    const totalTime = tasks.reduce((acc, task) => acc + task.duration, 0);
  
    return (
      <div className="bg-white shadow-xl rounded p-6 w-full border-2 border-gray-400">
        <div className="flex justify-between items-center mb-4">
        <span className="text-md font-bold ">{title}</span>
          <span>Tasks: {totalTasks}</span>
          <span>{totalTime} min</span>
        </div>
        <div className="grid grid-cols-1 gap-2 mb-4">
          {tasks.map((task, index) => (
            <TaskCard key={index} task={task} />
          ))}
        </div>
        <div className='flex flex-col justify-center'>
            <Button name={typeOfButton} onSelect={onSelect} color={color}/>
        </div>
      </div>
    );
  };
  
  export default Card;