// utils/ExpandableText.jsx
import { useState } from "react";

const truncateWords = (html, wordLimit = 20) => {
  if (!html) return "";

  // Untuk preview, kita ambil teks saja tapi pertahankan struktur dasar
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  // Hapus elemen gambar rumus untuk preview teks
  const images = tempDiv.getElementsByTagName('img');
  for (let i = images.length - 1; i >= 0; i--) {
    if (images[i].src.includes('data:image/png;base64')) {
      images[i].parentNode.removeChild(images[i]);
    }
  }
  
  const plainText = tempDiv.textContent || tempDiv.innerText || '';
  const words = plainText.trim().split(/\s+/);

  if (words.length <= wordLimit) {
    return plainText;
  }

  return words.slice(0, wordLimit).join(" ") + " ...";
};

const ExpandableText = ({ text, limit = 100 }) => {
  // Pastikan text selalu string
  const textString = String(text || '');
  const [isExpanded, setIsExpanded] = useState(false);

  const shouldTruncate = textString.length > limit;
  const displayText = isExpanded || !shouldTruncate 
    ? textString 
    : textString.substring(0, limit) + '...';

  return (
    <div className="expandable-text">
      <div dangerouslySetInnerHTML={{ __html: displayText }} />
      {shouldTruncate && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 hover:text-blue-800 text-sm mt-1 focus:outline-none"
        >
          {isExpanded ? 'Tutup' : 'Baca Selengkapnya'}
        </button>
      )}
    </div>
  );
};

export default ExpandableText;