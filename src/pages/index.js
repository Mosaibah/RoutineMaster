'use client'
import React from 'react'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Card from '../components/Card';
import { useEffect, useState } from 'react';
import { Auth } from 'aws-amplify';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { useRef } from 'react';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const chartRef = useRef(null);

  const [templatesData, setTemplatesData] = useState([]);
  const [todayTemplate, settodayTemplate] = useState([]);
  const [hasRecordToday, sethasRecordToday] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [chartOption, setChartOption] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const colors = [
    'rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 159, 64, 0.2)',
    // ... 20 colors
  ];
  const borderColor = [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
  ];

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const user = await Auth.currentAuthenticatedUser();
        const userId = user.attributes.sub;
        const endpoint = `https://6i4ntknht5.execute-api.us-east-1.amazonaws.com/staging/home?userId=${userId}`;
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        // console.log(response)
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
    
        const data = await response.json();
        if(data.hasRecordToday){
          settodayTemplate(data)
            const TasksObj = Object.values(data.tasks)
            const TasksName = TasksObj.map((task) => [
              task.name,
            ]);
            const TasksDuration = TasksObj.map((task) => [
              task.duration,
            ]);
            const TasksId = TasksObj.map((task) => [
              task.id,
            ]);
            console.log(TasksName)
            console.log(TasksDuration)
            console.log(TasksId)
          const chartSampleData = {
            labels : TasksName,
            datasets: [
              {
                label: '# of Votes',
                data: TasksDuration,
                backgroundColor: 
                  colors.slice(0, TasksName.length),
                borderColor: borderColor.slice(0, TasksName.length),
                borderWidth: 1,
              },
            ],
          }

          const options = {
            onElementsClick: (event, elements) => {
              if (elements.length > 0) {
                // const chart = chartRef.current;
                const element = elements[0];
                const task = element._model.label;
                console.log(task)
                // Navigate to the task page using the task id
                router.push(`/${task.id}`);
              }
            },
            // ... Other chart options
          };
          setChartOption(options)
          setChartData(chartSampleData)
          setIsLoading(false)
          // setChartData()
        }else{
          setTemplatesData(data)
        }
        sethasRecordToday(data.hasRecordToday)
        // setTemplatesData(templates)
        console.log('data:', data);
      } catch (error) {
        console.error('Error fetching templates:', error);
      }
    }

    fetchTemplates();
  }, []);

  const handleSelect = () => {
    console.log('Card selected');
  };
  
  ChartJS.register(ArcElement, Tooltip, Legend);
  


  return (
  <>
          {!hasRecordToday ? (
      <>
      <div className=' px-2 py-4 bg-gray-300 font-white mt-4 mx-4 rounded-md text-center text-lg font-semibold'>
        Choose template for today
      </div>
      <div className="mx-6 px-4 py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

            {templatesData.map((template, index) => (
            <Card key={index} title={template.title} templateId={template.id}
                  tasks={template.tasks} onSelect={handleSelect} 
                  typeOfButton="Select"
                  color="green"/>
          ))}
          
          </div>
        </div>
        </>
          ):(  
            isLoading ? <span></span> : (
            <>
            <div className=' px-2 py-4 mb-5 bg-gray-300 font-white mt-4 mx-4 rounded-md text-center text-lg font-semibold'>
            GOOO
          </div>
            <div className='md:w-1/2 md:h-1/2 mx-auto my-12'>
              
          <Pie chartRef={chartRef} data={chartData} options={chartOption}/> 
          </div>
          </>
          ))}
  </>
  )
}
