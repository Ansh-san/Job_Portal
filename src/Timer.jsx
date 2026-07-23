import { useState, useEffect } from "react";

function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    console.log("Timer Mounted");

    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      console.log("Timer Unmounted");
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      <h2>{seconds} Seconds</h2>
    </div>
  );
}

export default Timer;