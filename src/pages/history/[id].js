import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState } from 'react';

const ClickablePieChart = () => {
  const router = useRouter();
  const historyId = router.query.id

  const [task, setTask] = useState([]);

  useEffect(() => {
    async function fetchTask() {
      try {
        // const user = await Auth.currentAuthenticatedUser();
        // const userId = user.attributes.sub;
        // const endpoint = `https://6i4ntknht5.execute-api.us-east-1.amazonaws.com/staging/templates?userId=${userId}`;
        const endpoint = `https://6i4ntknht5.execute-api.us-east-1.amazonaws.com/staging/countdown/${historyId}`;
        // console.log(userId)
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        console.log(response)
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
    
        setTask(await response.json())
      } catch (error) {
        console.error('Error fetching templates:', error);
      }
    }

    fetchTask();
  }, [historyId]);
  console.log('tasks', task)

  return (
    <>
     
    </>
  );
};

export default ClickablePieChart;
