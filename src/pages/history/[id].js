import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { PieChart } from "react-minimal-pie-chart";
import "bootstrap-icons/font/bootstrap-icons.css";
const ClickablePieChart = () => {
  const router = useRouter();
  const historyId = router.query.id;

  const [task, setTask] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);
  const timerRef = useRef(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [worker, setWorker] = useState(null);

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
        data.Remaining = data.Remaining * 60;
        setTask(data);
        setTimeLeft(data.Remaining);
        setLoading(false);
        setElapsedTime(data.Remaining - data.Remaining);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    }

    fetchTask();
  }, [historyId]);
  useEffect(() => {
    if (timerRunning) {
      if (!worker) {
        const timerWorker = new Worker("/timerWorker.js");
        setWorker(timerWorker);
      }
    } else {
      if (worker) {
        worker.terminate();
        setWorker(null);
      }
    }

    return () => {
      if (worker) {
        worker.terminate();
      }
    };
  }, [timerRunning]);

  useEffect(() => {
    if (worker) {
      const handleMessage = () => {
        if (timerRunning && timeLeft > 0) {
          setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
        }
      };

      worker.addEventListener("message", handleMessage);

      return () => {
        worker.removeEventListener("message", handleMessage);
      };
    }
  }, [worker, timerRunning, timeLeft]);

  useEffect(() => {
    if (worker) {
      worker.postMessage({ timerRunning });
    }
  }, [worker, timerRunning]);

  const updateCountdown = async (remainingTime) => {
    if (!timerStarted) {
      return;
    }

    // status = (Paused, 0=>Completed)
    // remaining = remainingTime
    // historyId
    let status = remainingTime ? "Paused" : "Completed";
    let update = {
      TasksHistoryId: historyId,
      Remaining: parseInt(remainingTime / 60),
      Status: status,
    };
    console.log("put request", update);

    try {
      const response = await fetch(
        "https://6i4ntknht5.execute-api.us-east-1.amazonaws.com/staging/countdown-update",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(update),
        }
      );
      console.log("response", response);

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
  const percentage = (timeLeft / task.Remaining) * 100;

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8 md:px-32 lg:w-4/6 lg:mx-auto">
        <div className="flex flex-col items-center">
          {!loading && (
            <PieChart
              data={[
                {
                  title: "Remaining Time",
                  value: percentage,
                  color: "#10B981",
                },
                {
                  title: "Elapsed Time",
                  value: 100 - percentage,
                  color: "#E5E7EB",
                },
              ]}
              lineWidth={20}
              rounded
              style={{ height: "200px" }}
            />
          )}
          <div className="mt-5">
            <p className="text-5xl  mb-6 ordinal tabular-nums">
              {formatTime(timeLeft)}
            </p>
          </div>
          {timeLeft > 0 && (
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-3 rounded-full flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20"
              onClick={toggleTimer}
            >
              {timerRunning ? (
                <i
                  className="bi bi-pause-fill"
                  style={{ fontSize: "1.5rem" }}
                ></i>
              ) : timeLeft < task.Remaining ? (
                <i
                  className="bi bi-play-fill"
                  style={{ fontSize: "1.5rem" }}
                ></i>
              ) : (
                <i
                  className="bi bi-play-fill"
                  style={{ fontSize: "1.5rem" }}
                ></i>
              )}
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default ClickablePieChart;
