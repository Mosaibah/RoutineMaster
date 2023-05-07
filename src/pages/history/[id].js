import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const ClickablePieChart = () => {
  const router = useRouter();
  const historyId = router.query.id;

  const [task, setTask] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    async function fetchTask() {
      if (!historyId) return;
      try {
        // const user = await Auth.currentAuthenticatedUser();
        // const userId = user.attributes.sub;
        // const endpoint = `https://6i4ntknht5.execute-api.us-east-1.amazonaws.com/staging/templates?userId=${userId}`;
        const endpoint = `https://6i4ntknht5.execute-api.us-east-1.amazonaws.com/staging/countdown/${historyId}`;
        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();
        setTask(data);
        setTimeLeft(data.Remaining);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    }

    fetchTask();
  }, [historyId]);

  useEffect(() => {
    if (timerRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
      if (timeLeft === 0) {
        updateCountdown(0);
      }
    }

    return () => clearInterval(timerRef.current);
  }, [timerRunning, timeLeft]);

  const updateCountdown = async (remainingTime) => {
    if(!timerStarted){
      return 
    } 
    console.log("update: ", remainingTime);

    // status = (Paused, 0=>Completed)
    // remaining = remainingTime
    // historyId 
    let status = remainingTime ? 'Paused' : 'Completed'
    let update = {
      "TasksHistoryId": historyId, 
      "Remaining": remainingTime ,
      "Status": status
    }
    console.log('put request', update)

    try {
      const response = await fetch("https://6i4ntknht5.execute-api.us-east-1.amazonaws.com/staging/countdown-update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(update),
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
    } catch (error) {
      console.error("Error updating countdown:", error);
    }
  };

  const toggleTimer = () => {
    if (!timerStarted) {
      setTimerStarted(true);
    }
    if (timerRunning) {
      updateCountdown(timeLeft);
    }
    setTimerRunning(!timerRunning);
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8 md:px-32 lg:w-4/6 lg:mx-auto">
        <h1 className="text-2xl font-bold mb-6">{timeLeft}</h1>
        {timeLeft > 0 && (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={toggleTimer}
          >
            {timerRunning
              ? "Pause"
              : timeLeft < task.Remaining
              ? "Resume"
              : "Start"}
          </button>
        )}
      </div>
    </>
  );
};

export default ClickablePieChart;
