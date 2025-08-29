import React from "react";
import Countdown from "react-countdown";

const CountdownTimer = ({ targetDate, onComplete }) => {
  const countdownRenderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      return <span className="text-red-500">00:00</span>;
    }

    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    const textColor = totalSeconds < 300 ? "text-red-500" : "text-white";

    return (
      <span className={textColor}>
        {hours > 0 ? `${hours}:` : ""}
        {minutes.toString().padStart(2, "0")}:
        {seconds.toString().padStart(2, "0")}
      </span>
    );
  };

  return (
    <div
      className={`font-mono text-xl font-bold px-4 py-2 rounded-lg border transition-colors ${
        targetDate && targetDate - Date.now() < 5 * 60 * 1000
          ? "bg-red-600 border-red-500"
          : "bg-gray-700 border-gray-600"
      }`}
    >
      ⏳{" "}
      {targetDate ? (
        <Countdown
          date={targetDate}
          renderer={countdownRenderer}
          onComplete={onComplete}
        />
      ) : (
        "00:00"
      )}
    </div>
  );
};

export default CountdownTimer;
