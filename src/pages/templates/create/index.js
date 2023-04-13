import { useState } from 'react';
import { Auth } from 'aws-amplify';

export default function CreateTemplate() {
  const [Title, setTitle] = useState('');
  const [tasks, setTasks] = useState([{ taskName: '', duration: '' }]);

  const GetUserData =  async () => {
    const { attributes } = await Auth.currentAuthenticatedUser();
    return attributes.sub
  }

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleTaskNameChange = (index, e) => {
    const newTasks = tasks.map((task, i) => (i === index ? { ...task, taskName: e.target.value } : task));
    setTasks(newTasks);
  };
  const handleTaskDurationChange = (index, e) => {
    const newTasks = tasks.map((task, i) => (i === index ? { ...task, duration: e.target.value } : task));
    setTasks(newTasks);
  };

  const addTask = () => {
    setTasks([...tasks, { taskName: '', duration: '' }]);
  };

  const removeTask = (index) => {
    setTasks(tasks.filter((_,i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const UserId = await GetUserData()
    const TasksSend = Object.values(tasks)
    const Tasks = TasksSend.map((task) => [
      task.taskName,
      task.duration,
    ]);
    console.log(Tasks)
    console.log(JSON.stringify({ Title, UserId , Tasks }))
    try {
      const response = await fetch('https://6i4ntknht5.execute-api.us-east-1.amazonaws.com/staging/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Title, UserId , Tasks })
      });
      // console.log({Tasks}.Tasks)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('Response data:', responseData);
    } catch (error) {
      console.error('Error submitting the form:', error);
    }
  };


  return (
    <div className="container mx-auto px-4 py-8  md:px-32 lg:w-4/6 lg:mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create Template</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="Title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            id="Title"
            type="text"
            value={Title}
            onChange={handleTitleChange}
            className="mt-1 block w-full border-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        {tasks.map((task, index) => (
            <div key={index} >
              Task {index + 1}
            <div  className='border-2 pt-2 px-2 mt-2 mb-3 rounded-md border-gray-300'>
                <div className="grid grid-cols-5 gap-4 mb-4">
                    <div className='col-span-3'>
                        <label htmlFor={`task-name-${index}`} className="block text-sm font-medium text-gray-700">
                            Task Name
                        </label>
                        <input
                            id={`task-name-${index}`}
                            type="text"
                            value={task.name}
                            onChange={(e) => handleTaskNameChange(index, e)}
                            className="mt-1 block w-full border-2 rounded-md border-gray-200 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                    </div>
                <div className='col-span-2'>
                    <label htmlFor={`task-duration-${index}`} className="block text-sm font-medium text-gray-700">
                        Duration
                    </label>
                    <input
                        id={`task-duration-${index}`}
                        type="number"
                        value={task.duration}
                        onChange={(e) => handleTaskDurationChange(index, e)}
                        className="mt-1 block w-full border-2 rounded-md border-gray-200 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </div>
                </div>

                {index ?(
                    <div className='flex justify-end'>
                    <button
                    type="button"
                    onClick={() => removeTask(index)}
                    className="inline-flex items-center justify-start mr-2 mb-2  rounded-md text-red-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500"
                    >
                    Remove
                  </button>
                  </div>
                    ) : (<span></span>)
                }
          </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addTask}
          className="inline-flex items-center justify-center p-2 rounded-md text-indigo-400 hover:text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
        >
          <span>Add Task ..</span>
        </button>
        <div className='flex justify-center'>

        <button
          type="submit"
          className="mt-4 w-3/4 ml-4 inline-flex items-center justify-center p-2 rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
          >
          <span>Create</span>
        </button>
            </div>
      </form>
    </div>
  );
}