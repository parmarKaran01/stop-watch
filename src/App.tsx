import { useState } from "react";
import "./App.css";
import Stopwatch from "./components/Stopwatch";
import { MODES } from "./components/utils";
import Navbar from "./components/Navbar";

type ModeType = "ASSESMENT" | "PRACTICE";
function App() {
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [mode, setMode] = useState("ASSESMENT" as ModeType);
  const [cooldownInterval, setCooldownInterval] = useState(1);

  const isPracticeMode = mode === MODES.PRACTICE;

  return (
    <>
      <Navbar
        showLandingPage={showLandingPage}
        setShowLandingPage={setShowLandingPage}
        mode={mode}
        cooldownInterval={cooldownInterval}
        setCooldownInterval={setCooldownInterval}
      />

      {showLandingPage ? (
        <div>
          <img
            src="/act-react-logo-removebg.png"
            width={200}
            height={200}
            alt="main-logo"
          />
          <div className="landingWrapper">
            <div className="modeDropdown">
              <label htmlFor="selectMode">Select Mode</label>
              <select
                id="selectMode"
                value={mode}
                onChange={(e) => setMode(e.target.value as ModeType)}
              >
                <option value="ASSESMENT">Assessment</option>
                <option value="PRACTICE">Practice</option>
              </select>
            </div>

            {isPracticeMode && (
              <div className="modeDropdown">
                <label htmlFor="intervalSelect">Select Interval </label>
                <select
                  id="intervalSelect"
                  value={cooldownInterval}
                  onChange={(e) =>
                    setCooldownInterval(parseInt(e.target.value))
                  }
                >
                  {[...Array(6).keys()].map((i) => (
                    <option key={i} value={i + 1}>
                      {i + 1} {i === 0 ? "second" : "seconds"}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <button onClick={() => setShowLandingPage(false)}>Start</button>
        </div>
      ) : (
        <Stopwatch cooldownInterval={cooldownInterval} />
      )}
    </>
  );
}

export default App;
