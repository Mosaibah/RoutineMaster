'use client'
import React from 'react'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Card from '../../components/Card';
import Link from 'next/link';

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

export default function Templates() {

  const handleSelect = () => {
    console.log('Card selected');
  };

  return (
  <>
    <div className="mx-6 px-4 py-8">
      <div className="flex justify-end items-center">
        <Link 
        href="/templates/create"
        className="bg-lime-500 text-white font-bold py-2 px-4 my-2 rounded-lg hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-lime-600 focus:ring-opacity-50 sm:text-sm md:text-base lg:text-lg xl:text-xl">
            New
        </Link>
      </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template, index) => (
            <Card key={index} title={template.title} 
                  tasks={template.tasks} onSelect={handleSelect} 
                  typeOfButton="Update"
                  color="amber"/>
          ))}
        </div>
      </div>
  </>
  )
}
