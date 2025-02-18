import { useState, useRef, useEffect, Fragment } from "react";
import "./Stopwatch.css";
import { COLOR_CODES, MODES } from "./utils";

interface Lap {
  lapTime: number;
  totalTime: number;
}

type StopwatchProps = {
  cooldownInterval: number;
  mode: "ASSESMENT" | "PRACTICE";
};

const Stopwatch = ({ cooldownInterval, mode }: StopwatchProps) => {
  const [time, setTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [laps, setLaps] = useState<Lap[]>([]);
  const [showAverage, setShowAverage] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<{ color: string; direction: string }>({
    color: "",
    direction: "",
  }); // Current prompt
  const [isWaitingForClick, setIsWaitingForClick] = useState<boolean>(false); // To handle the 1-second delay
  const [countdown, setCountdown] = useState<number | null>(null); // Countdown state
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isPracticeMode = mode === MODES.PRACTICE;

  // Colors and directions
  const colors = Object.values(COLOR_CODES);
  const directions = ["LEFT", "RIGHT"];

  // Generate a random prompt
  const generateRandomPrompt = (): { color: string; direction: string } => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomDirection =
      directions[Math.floor(Math.random() * directions.length)];
    return { color: randomColor, direction: randomDirection };
  };

  // Start the countdown and then the game
  const startGame = (): void => {
    setTime(0);
    setLaps([]);
    setShowAverage(false);
    setPrompt({ color: "", direction: "" });
    setIsWaitingForClick(false);

    // Start countdown
    setCountdown(3);
    let count = 3;
    const countdownInterval = setInterval(() => {
      count -= 1;
      if (count >= 0) {
        setCountdown(count);
      } else {
        clearInterval(countdownInterval);
        setCountdown(null);
        setIsRunning(true); // Start the game after countdown
        setPrompt(generateRandomPrompt()); // Show the first prompt
      }
    }, 1000);
  };

  // Handle screen click (record lap)
  const handleClick = (): void => {
    if (isRunning && !isWaitingForClick) {
      // Record lap time
      const lapTime = time; // Lap time is the current timer value
      setLaps([...laps, { lapTime, totalTime: time }]);

      // Reset the timer to 0
      setTime(0);

      // Stop the timer during the 1-second delay
      setIsRunning(false);
      setIsWaitingForClick(true);

      // Wait for 1 second before showing the next prompt and starting the timer again
      setTimeout(() => {
        setPrompt(generateRandomPrompt()); // Show new prompt after 1 second
        setIsWaitingForClick(false);
        setIsRunning(true); // Start the timer again
      }, 1000);
    }
  };

  // Stop the game
  const stopGame = (): void => {
    setIsRunning(false);
  };

  //resume the game
  const resumeGame = () => {
    setIsRunning(true);
  };

  // Reset the game
  const resetGame = (): void => {
    clearInterval(intervalRef.current ?? 0);
    setIsRunning(false);
    setTime(0);
    setLaps([]);
    setShowAverage(false);
    setPrompt({ color: "", direction: "" });
    setIsWaitingForClick(false);
    setCountdown(null);
  };

  // Calculate average lap time
  const calculateAverageLapTime = (): number => {
    if (laps.length === 0) return 0;
    const totalLapTime = laps.reduce((sum, lap) => sum + lap.lapTime, 0);
    return totalLapTime / laps.length;
  };

  // Format time into MM:SS.MS
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = Math.floor((time % 1000) / 10);

    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}.${milliseconds.toString().padStart(2, "0")}`;
  };

  // Effect to handle the timer
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    } else {
      clearInterval(intervalRef.current ?? 0);
    }

    return () => {
      clearInterval(intervalRef.current ?? 0);
    };
  }, [isRunning]);

  useEffect(() => {
    let body = document.querySelector("body");
    if (body) {
      if (isWaitingForClick) {
        body.style.backgroundColor = "#242424";
      } else {
        body.style.backgroundColor = prompt.color.toLowerCase();
      }
    }
  }, [prompt, isWaitingForClick]);

  // Effect to handle prompt change in practice mode
  useEffect(() => {
    let body = document.querySelector("body");
    if (isPracticeMode && isRunning && !isWaitingForClick) {
      const promptInterval = setInterval(() => {
        handleClick();
      }, cooldownInterval * 1000);

      return () => {
        clearInterval(promptInterval);
        if (body) {
          body.style.backgroundColor = "#242424";
        }
      };
    }
  }, [isPracticeMode, isRunning, cooldownInterval]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px", maxWidth : '350px' }}>
      {countdown !== null && (
        <div style={{ fontSize: "3rem", margin: "20px" }}>
          {countdown > 0 ? countdown : "Go!"}
        </div>
      )}
      <div style={{ fontSize: "1.5rem", margin: "20px" }}>
        <h1>{prompt.direction}</h1>
      </div>
      <div>
        <h2>{formatTime(time)}</h2>
      </div>
      <div className="buttonContainer">
        <button onClick={startGame} disabled={isRunning || countdown !== null}>
          Start
        </button>
        {!isPracticeMode ? (
          <button onClick={stopGame} disabled={!isRunning}>Stop</button>
        ) : (
          <button onClick={isRunning ? stopGame : resumeGame}>
            {isRunning ? "Pause" : "Resume"}
          </button>
        )}

        <button onClick={resetGame}>Reset</button>
        <button
          onClick={() => setShowAverage(!showAverage)}
          disabled={laps.length === 0}
        >
          {showAverage ? "Hide Average" : "Average"}
        </button>
      </div>
      {!isPracticeMode && (
        <Fragment>
          <div
            onClick={handleClick}
            style={{
              cursor:
                isRunning && !isWaitingForClick ? "pointer" : "not-allowed",
              margin: "20px",
              padding: "20px",
              border: "1px solid #000",
            }}
          >
            <h2>
              {isWaitingForClick
                ? "Wait for the next prompt..."
                : "Click Here to Record Lap"}
            </h2>
          </div>
          <div>
            <h2>Laps</h2>
            <ul>
              {laps.map((lap, index) => (
                <li key={index}>
                  Lap {index + 1}: {formatTime(lap.lapTime)}
                </li>
              ))}
            </ul>
          </div>
        </Fragment>
      )}

      {showAverage && laps.length > 0 && (
        <div>
          <h3>Average Lap Time: {formatTime(calculateAverageLapTime())}</h3>
        </div>
      )}
    </div>
  );
};

export default Stopwatch;
