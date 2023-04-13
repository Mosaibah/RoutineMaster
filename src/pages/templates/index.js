'use client'
import React from 'react'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Card from '../../components/Card';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Auth } from 'aws-amplify';

const inter = Inter({ subsets: ['latin'] })

export default function Templates() {

  const [templatesData, setTemplatesData] = useState([]);

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const user = await Auth.currentAuthenticatedUser();
        const userId = user.attributes.sub;
        const endpoint = `https://6i4ntknht5.execute-api.us-east-1.amazonaws.com/staging/templates?userId=${userId}`;
        console.log(userId)
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
    
        const templates = await response.json();
        setTemplatesData(templates)
        console.log('Templates:', templates);
      } catch (error) {
        console.error('Error fetching templates:', error);
      }
    }

    fetchTemplates();
  }, []);

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
          {templatesData.map((template, index) => (
            <Card key={index} title={template.templateName} 
                  tasks={template.tasks} onSelect={handleSelect} 
                  typeOfButton="Update"
                  color="amber"/>
          ))}
        </div>
      </div>
  </>
  )
}
