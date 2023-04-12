'use client'
import React from 'react'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Card from '../components/Card';

const inter = Inter({ subsets: ['latin'] })


const templates = [
  {
    title: "Template 1",
    tasks: [
      { name: "Task 1", duration: 30 },
      { name: "Task 2", duration: 45 },
      { name: "Task 3", duration: 60 },
      { name: "Task 4", duration: 90 },
    ],
  },
  {
    title: "Template 2",
    tasks: [
      { name: "Task 1", duration: 25 },
      { name: "Task 2", duration: 40 },
    ],
  },
  {
    title: "Template 3",
    tasks: [
      { name: "Task 2", duration: 35 },
      { name: "Task 3", duration: 50 },
      { name: "Task 4", duration: 80 },
    ],
  },
];

export default function Home() {

  const handleSelect = () => {
    console.log('Card selected');
  };

  return (
  <>
      <div className=' px-2 py-4 bg-gray-300 font-white mt-4 mx-4 rounded-md text-center text-lg font-semibold'>
        Choose template for today
      </div>
      <div className="mx-6 px-4 py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template, index) => (
            <Card key={index} title={template.title} 
                  tasks={template.tasks} onSelect={handleSelect} 
                  typeOfButton="Select"
                  color="green"/>
          ))}
        </div>
      </div>
  </>
  )
}
