let timerInterval;

self.addEventListener("message", (e) => {
  const { timerRunning } = e.data;

  if (timerInterval) {
    clearInterval(timerInterval);
  }

  if (timerRunning) {
    timerInterval = setInterval(() => {
      self.postMessage({});
    }, 1000);
  }
});
