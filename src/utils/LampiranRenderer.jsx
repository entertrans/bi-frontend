// src/components/LampiranRenderer.jsx
import React, { useState, useRef } from "react";
import { HiVolumeUp, HiPlay, HiPause } from "react-icons/hi";

const LampiranRenderer = ({ lampiran, soalId, baseUrl = "http://localhost:8080" }) => {
  const [playingAudio, setPlayingAudio] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const playerRef = useRef(null);

  if (!lampiran) {
    return <span className="text-gray-400 text-sm">-</span>;
  }

  const getFilePath = (path) => `${baseUrl}/${path.replace(/\\/g, "/")}`;

  const toggleAudio = () => {
    const player = playerRef.current;
    if (!player) return;

    if (playingAudio === soalId) {
      player.pause();
      setPlayingAudio(null);
    } else {
      player.play();
      setPlayingAudio(soalId);
    }
  };

  const handleTimeUpdate = (e) => {
    setCurrentTime(e.target.currentTime);
    setDuration(e.target.duration || 0);
  };

  const handleSeek = (e) => {
    const player = playerRef.current;
    if (!player) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    player.currentTime = percent * duration;
  };

  const formatDuration = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  switch (lampiran.tipe_file) {
    case "image":
      return (
        <img
          src={getFilePath(lampiran.path_file)}
          alt="lampiran"
          className="w-12 h-12 object-cover rounded border"
        />
      );

    case "audio":
      return (
        <div className="flex flex-col bg-gradient-to-br from-purple-50 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 p-3 rounded-lg w-64 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full shadow flex items-center justify-center mr-2">
                <HiVolumeUp className="text-white text-sm" />
              </div>
              <span className="text-xs font-medium truncate max-w-[100px]">
                {lampiran.nama_file || "Audio Soal"}
              </span>
            </div>
            <button
              onClick={toggleAudio}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
            >
              {playingAudio === soalId ? (
                <HiPause className="text-blue-600 text-sm" />
              ) : (
                <HiPlay className="text-blue-600 text-sm ml-0.5" />
              )}
            </button>
          </div>

          <div className="mb-1">
            <div
              className="h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden cursor-pointer"
              onClick={handleSeek}
            >
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>{formatDuration(currentTime)}</span>
              <span>{formatDuration(duration)}</span>
            </div>
          </div>

          <audio
            ref={playerRef}
            src={getFilePath(lampiran.path_file)}
            onEnded={() => setPlayingAudio(null)}
            onTimeUpdate={handleTimeUpdate}
          />
        </div>
      );

    case "video":
      return (
        <div className="w-40">
          <video
            src={getFilePath(lampiran.path_file)}
            controls
            className="w-full h-20 object-cover rounded"
          />
        </div>
      );

    default:
      return <span className="text-gray-400 text-sm">Unsupported</span>;
  }
};

export default LampiranRenderer;
