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

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const [templatesData, setTemplatesData] = useState([]);
  const [todayTemplate, settodayTemplate] = useState([]);
  const [hasRecordToday, sethasRecordToday] = useState([]);


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
  const data = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
  <>
      <div className=' px-2 py-4 bg-gray-300 font-white mt-4 mx-4 rounded-md text-center text-lg font-semibold'>
        Choose template for today
      </div>
      <div className="mx-6 px-4 py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {!hasRecordToday ? templatesData.map((template, index) => (
            <Card key={index} title={template.title} templateId={template.id}
                  tasks={template.tasks} onSelect={handleSelect} 
                  typeOfButton="Select"
                  color="green"/>
          )): <Pie data={data} />}
        </div>
      </div>
  </>
  )
}
