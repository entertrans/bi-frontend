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

const ExpandableText = ({ text, limit = 20 }) => {
  const [expanded, setExpanded] = useState(false);

  if (!text) {
    return <span className="italic text-gray-500">[Tidak ada konten]</span>;
  }

  // Cek apakah ada gambar/rumus dalam konten
  const hasMathFormula = text.includes('data:image/png;base64');
  const plainText = text.replace(/<[^>]+>/g, "");
  const isTooLong = plainText.trim().split(/\s+/).length > limit;

  return (
    <div className="prose prose-sm max-w-none dark:prose-invert">
      {expanded ? (
        // Expanded → tampilkan HTML asli dengan rumus
        <div 
          className="soal-content question-content text-base leading-relaxed"
          dangerouslySetInnerHTML={{ __html: text }} 
        />
      ) : (
        // Collapsed → tampilkan preview
        <div className="preview-content">
          {truncateWords(text, limit) || (
            <span className="italic text-gray-500">
              {hasMathFormula ? '[Berisi rumus matematika]' : '[Berisi konten khusus]'}
            </span>
          )}
        </div>
      )}

      {(isTooLong || hasMathFormula) && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-blue-600 text-sm hover:underline ml-1 mt-1 dark:text-blue-400"
        >
          {expanded ? "Sembunyikan" : "Lihat detail"}
        </button>
      )}
    </div>
  );
};

export default ExpandableText;