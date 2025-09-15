import React, { useState, useRef, useEffect } from "react";
import Modal from "react-modal";
import { HiPlay, HiPause, HiVolumeUp, HiDotsHorizontal } from "react-icons/hi";

// Custom styles untuk modal
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#1f2937",
    border: "1px solid #374151",
    borderRadius: "0.5rem",
    padding: "1rem",
    maxWidth: "90vw",
    maxHeight: "90vh",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    zIndex: 50,
  },
};

const LampiranViewer = ({
  lampiran,
  altText = "Lampiran soal",
  maxWidth = "200px",
  maxHeight = "150px",
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const audioRef = useRef(null);

  // Format waktu (detik ke menit:detik)
  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Handle play/pause
  const togglePlayPause = () => {
  if (!audioRef.current) return;

  if (isPlaying) {
    audioRef.current.pause();
    setIsPlaying(false);
  } else {
    audioRef.current.play()
      .then(() => setIsPlaying(true))
      .catch((error) => {
        console.error("Error playing audio:", error);
        setIsPlaying(false);
      });
  }
};


  // Handle perubahan progress
  const handleProgressChange = (e) => {
    if (!audioRef.current) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Handle perubahan volume
  const handleVolumeChange = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newVolume = Math.max(0, Math.min(1, percent));

    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // Update waktu saat audio diputar
 useEffect(() => {
  const audio = audioRef.current;
  if (!audio) return;

  const updateTime = () => setCurrentTime(audio.currentTime);
  const updateDuration = () => setDuration(audio.duration);
  const handleEnd = () => setIsPlaying(false);

  audio.addEventListener("timeupdate", updateTime);
  audio.addEventListener("loadedmetadata", updateDuration);
  audio.addEventListener("ended", handleEnd);

  return () => {
    audio.removeEventListener("timeupdate", updateTime);
    audio.removeEventListener("loadedmetadata", updateDuration);
    audio.removeEventListener("ended", handleEnd);
  };
}, [lampiran]);

  // Reset audio state setiap kali lampiran berubah
useEffect(() => {
  setIsPlaying(false);
  setCurrentTime(0);
  setDuration(0);
  if (audioRef.current) {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  }
}, [lampiran]);

  // Early return harus setelah semua hooks
  if (!lampiran) return null;

  const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:8080";

  const renderLampiran = () => {
    const fileUrl = `${baseUrl}/${lampiran.path_file.replace(/\\/g, "/")}`;

    switch (lampiran.tipe_file) {
      case "image":
        return (
          <div className="relative group">
            <img
              src={fileUrl}
              alt={altText}
              className="object-contain rounded-lg border border-gray-600 cursor-pointer transition-transform group-hover:scale-105"
              style={{
                maxWidth: maxWidth,
                maxHeight: maxHeight,
                width: "auto",
                height: "auto",
              }}
              onClick={() => setIsModalOpen(true)}
            />
            <div
              className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity cursor-pointer flex items-center justify-center"
              onClick={() => setIsModalOpen(true)}
            >
              <span className="text-white opacity-0 group-hover:opacity-100 text-xs">
                Klik untuk memperbesar
              </span>
            </div>
          </div>
        );

      case "video":
        return (
          <video
            controls
            className="max-w-full max-h-48 rounded-lg border border-gray-600"
            style={{ maxWidth: maxWidth, maxHeight: maxHeight }}
          >
            <source src={fileUrl} type="video/mp4" />
            Browser Anda tidak mendukung pemutaran video.
          </video>
        );

      case "audio":
        return (
          <div className="bg-gradient-to-br from-purple-600 to-blue-700 rounded-lg p-2 shadow-md w-full max-w-xs">
            {/* Kontrol utama dan info file inline */}
            <div className="flex items-center justify-between">
              {/* Tombol play/pause */}
              <button
                onClick={togglePlayPause}
                className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow hover:scale-105 transition-transform flex-shrink-0"
              >
                {isPlaying ? (
                  <HiPause className="text-purple-700 text-sm" />
                ) : (
                  <HiPlay className="text-purple-700 text-sm ml-0.5" />
                )}
              </button>

              {/* Nama file dan waktu */}
              <div className="flex-1 mx-2 min-w-0">
                <p className="text-white text-xs font-medium truncate">
                  {lampiran.nama_file || "Audio Soal"}
                </p>
                <div className="flex justify-between text-[10px] text-gray-300">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Tombol volume */}
              <button
                className="text-white opacity-70 hover:opacity-100 transition-opacity flex-shrink-0"
                onClick={() => setShowVolumeControl(!showVolumeControl)}
              >
                <HiVolumeUp className="text-sm" />
              </button>
            </div>

            {/* Progress bar */}
            <div
              className="h-1 bg-gray-600 rounded-full mt-1 cursor-pointer"
              onClick={handleProgressChange}
            >
              <div
                className="h-full bg-gradient-to-r from-green-400 to-cyan-400 rounded-full transition-all duration-300"
                style={{
                  width: duration ? `${(currentTime / duration) * 100}%` : "0%",
                }}
              ></div>
            </div>

            {/* Kontrol volume (muncul saat diklik) */}
            {showVolumeControl && (
              <div className="flex items-center mt-1">
                <div
                  className="h-1 bg-gray-600 rounded-full flex-1 relative cursor-pointer"
                  onClick={handleVolumeChange}
                >
                  <div
                    className="h-full bg-white rounded-full"
                    style={{ width: `${volume * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Audio element (tersembunyi) */}
            <audio
              ref={audioRef}
              src={fileUrl}
              preload="metadata"
              onError={() => console.error("Error loading audio")}
            />
          </div>
        );

      case "pdf":
        return (
          <div
            className="border border-gray-600 rounded-lg p-2 bg-gray-750"
            style={{ maxWidth: maxWidth }}
          >
            <div className="flex items-center mb-2">
              <svg
                className="w-6 h-6 text-red-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-white text-sm">{lampiran.nama_file}</span>
            </div>
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-xs flex items-center"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Unduh PDF
            </a>
          </div>
        );

      default:
        return (
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 text-xs flex items-center border border-gray-600 rounded-lg p-2 bg-gray-750"
            style={{ maxWidth: maxWidth }}
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            Unduh File
          </a>
        );
    }
  };

  return (
    <>
      <div className="mt-1">{renderLampiran()}</div>

      {/* Modal untuk gambar */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={customStyles}
        contentLabel="Lampiran Soal"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white text-lg">Lampiran Soal</h3>
          <button
            onClick={() => setIsModalOpen(false)}
            className="text-gray-400 hover:text-white text-2xl"
          >
            &times;
          </button>
        </div>
        <img
          src={`${baseUrl}/${lampiran.path_file.replace(/\\/g, "/")}`}
          alt={altText}
          className="max-w-full max-h-[70vh] object-contain"
        />
      </Modal>
    </>
  );
};

export default LampiranViewer;
