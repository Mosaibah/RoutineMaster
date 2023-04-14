'use client'
import React from 'react'
import TaskCard from '../components/TaskCard'
import Button from '../components/Button'
import { useRouter } from 'next/router';
import { Auth } from 'aws-amplify';

const Card = ({ title, tasks, onSelect , typeOfButton, color, templateId}) => {
    const totalTasks = tasks.length;
    const totalTime = tasks.reduce((acc, task) => acc + task.duration, 0);
    const router = useRouter();

    const GetUserData =  async () => {
      const { attributes } = await Auth.currentAuthenticatedUser();
      return attributes.sub
    }
    async function chooseTemplate() {
      // const userId = await Auth.currentAuthenticatedUser();
      const userId = await GetUserData()
      try {
      const response = await fetch('https://6i4ntknht5.execute-api.us-east-1.amazonaws.com/staging/choose-template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({templateId,userId})
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('Response data:', responseData);
      router.reload()
    } catch (error) {
      console.error('Error submitting the form:', error);
    }
    } 

    return (
      <div className="bg-white shadow-xl rounded p-6 w-full border-2 border-gray-400">
        <div className="flex justify-between items-center mb-4">
        <span className="text-md font-semibold ">{title}</span>
          <span>{totalTasks} tasks</span>
          <span>{totalTime} min</span>
        </div>
        <div className="grid grid-cols-1 gap-2 mb-4">
          {tasks.map((task, index) => (
            <TaskCard key={index} task={task} />
          ))}
        </div>
        <div className='flex flex-col justify-center'>
          {typeOfButton == "Select" ?(
               <button
               className={`text-${color}-600 py-2 px-4 rounded-md font-medium border-2 border-${color}-600`}
               // onClick={onClick}
               onClick={chooseTemplate}
               >
               Select
               </button>
          ): (
            <Button name={typeOfButton} onSelect={onSelect} color={color} templateId={templateId}/>

          )}
        </div>
      </div>
    );
  };
  
  export default Card;