import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import HTMLFlipBook from "react-pageflip";

// Setting PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.js`;

const FlipBookPDF = ({ fileUrl, onClose }) => {
  const [numPages, setNumPages] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-gray-800 flex justify-between items-center">
          <h2 className="text-white font-semibold">Flipbook PDF</h2>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg"
          >
            Tutup
          </button>
        </div>

        {/* Flipbook */}
        <div className="flex-1 flex items-center justify-center overflow-hidden bg-gray-700">
          <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess}>
            {numPages && (
              <HTMLFlipBook
                width={500}
                height={700}
                showCover={true}
                className="shadow-2xl"
              >
                {Array.from(new Array(numPages), (el, index) => (
                  <div key={`page_${index + 1}`} className="bg-white">
                    <Page pageNumber={index + 1} width={500} />
                  </div>
                ))}
              </HTMLFlipBook>
            )}
          </Document>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-800 text-gray-300 text-sm">
          {numPages ? `${numPages} halaman` : "Memuat..."}
        </div>
      </div>
    </div>
  );
};

export default FlipBookPDF;
