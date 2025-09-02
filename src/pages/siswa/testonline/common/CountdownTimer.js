import React from "react";
import Countdown from "react-countdown";

const CountdownTimer = ({ targetDate, onComplete }) => {
  const countdownRenderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return (
        <div className="text-red-500 font-semibold">
          ⏰ Waktu Habis
        </div>
      );
    }

    const totalSeconds = days * 86400 + hours * 3600 + minutes * 60 + seconds;
    const textColor = totalSeconds < 300 ? "text-red-500" : "text-white";

    return (
      <div className={textColor}>
        {days > 0 && (
          <span className="text-yellow-400">
            {days} hari{" "}
          </span>
        )}
        <span>
          {hours.toString().padStart(2, "0")}:
          {minutes.toString().padStart(2, "0")}:
          {seconds.toString().padStart(2, "0")}
        </span>
      </div>
    );
  };

  // Hitung selisih waktu untuk menentukan warna background
  const timeDifference = targetDate ? targetDate - Date.now() : 0;
  const isDanger = timeDifference < 5 * 60 * 1000; // Kurang dari 5 menit

  return (
    <div
      className={`font-mono text-xl font-bold px-4 py-2 rounded-lg border transition-colors ${
        isDanger
          ? "bg-red-600 border-red-500"
          : "bg-gray-700 border-gray-600"
      }`}
    >
      {targetDate ? (
        <Countdown
          date={targetDate}
          renderer={countdownRenderer}
          onComplete={onComplete}
        />
      ) : (
        "00:00:00"
      )}
    </div>
  );
};

export default CountdownTimer;