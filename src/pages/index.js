import { useRef } from 'react';
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
import { Pie, getElementAtEvent } from 'react-chartjs-2';
import ClickablePieChart from '../components/ClickablePieChart';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  ChartJS.register(ArcElement, Tooltip, Legend);
  const chartRef = useRef(null);

  const [templatesData, setTemplatesData] = useState([]);
  const [todayTemplate, settodayTemplate] = useState([]);
  const [hasRecordToday, sethasRecordToday] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataChart, setDataChart] = useState([])


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
          console.log(data['tasks'])
          setDataChart(data['tasks'])
         
          setIsLoading(false)
        }else{
          setTemplatesData(data)
        }
        sethasRecordToday(data.hasRecordToday)
        // console.log('data:', data);
      } catch (error) {
        console.error('Error fetching templates:', error);
      }
    }

    fetchTemplates();
  }, []);

  const handleSelect = () => {
    console.log('Card selected');
  };
  
  const handle = (event) => {
    if(getElementAtEvent(chartRef.current, event).length > 0){
      console.log(getElementAtEvent(chartRef.current, event)[0])
    }
  }

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
                <ClickablePieChart tasks={dataChart} />

          </div>
          </>
          ))}
  </>
  )
}
