import React from "react";
import "./Navbar.css";
import { MODES } from "./utils";

type Props = {
  showLandingPage: boolean;
  setShowLandingPage: React.Dispatch<React.SetStateAction<boolean>>;
  cooldownInterval: number;
    setCooldownInterval: React.Dispatch<React.SetStateAction<number>>;
    mode : "ASSESMENT" | "PRACTICE";
};

const Navbar = ({ showLandingPage, setShowLandingPage, mode, setCooldownInterval, cooldownInterval }: Props) => {
    const isPracticeMode = mode === MODES.PRACTICE;
  const goback = () => {
    setShowLandingPage(true);
  };
  return (
    <nav className="navbar">
      <img
        src="/act-react-logo-removebg.png"
        width={60}
        height={60}
        alt="main-logo"
      />
      {
        isPracticeMode && !showLandingPage && <div className="modeDropdown">
        <label htmlFor="intervalSelect">Select Interval </label>
        <select
          id="intervalSelect"
          onChange={(e) => setCooldownInterval(parseInt(e.target.value))}
          value={cooldownInterval}
        >
          {[...Array(6).keys()].map((i) => (
            <option key={i} value={i + 1}>
              {i + 1} {i === 0 ? "second" : "seconds"}
            </option>
          ))}
        </select>
      </div>
      }
      {!showLandingPage && <button onClick={goback}>Back</button>}
    </nav>
  );
};

export default Navbar;
