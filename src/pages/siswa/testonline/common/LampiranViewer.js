import React, { useState } from 'react';
import Modal from 'react-modal';

// Custom styles untuk modal
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#1f2937',
    border: '1px solid #374151',
    borderRadius: '0.5rem',
    padding: '1rem',
    maxWidth: '90vw',
    maxHeight: '90vh'
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 50
  }
};

const LampiranViewer = ({ 
  lampiran, 
  altText = "Lampiran soal",
  maxWidth = "200px",
  maxHeight = "150px"
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!lampiran) return null;

  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';

  const renderLampiran = () => {
    const fileUrl = `${baseUrl}/${lampiran.path_file}`;
    
    switch (lampiran.tipe_file) {
      case 'image':
        return (
          <div className="relative group">
            <img
              src={fileUrl}
              alt={altText}
              className="object-contain rounded-lg border border-gray-600 cursor-pointer transition-transform group-hover:scale-105"
              style={{ 
                maxWidth: maxWidth, 
                maxHeight: maxHeight,
                width: 'auto',
                height: 'auto'
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
      
      case 'video':
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
      
      case 'audio':
        return (
          <audio controls className="w-full">
            <source src={fileUrl} type="audio/mpeg" />
            Browser Anda tidak mendukung pemutaran audio.
          </audio>
        );
      
      case 'pdf':
        return (
          <div className="border border-gray-600 rounded-lg p-2 bg-gray-750" style={{ maxWidth: maxWidth }}>
            <div className="flex items-center mb-2">
              <svg className="w-6 h-6 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
              <span className="text-white text-sm">{lampiran.nama_file}</span>
            </div>
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-xs flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
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
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Unduh File
          </a>
        );
    }
  };

  return (
    <>
      <div className="mt-1">
        {renderLampiran()}
      </div>

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
          src={`${baseUrl}/${lampiran.path_file}`}
          alt={altText}
          className="max-w-full max-h-[70vh] object-contain"
        />
      </Modal>
    </>
  );
};

export default LampiranViewer;