import { useState } from "react";

// Fungsi util untuk motong teks
const truncateWords = (text, wordLimit = 20) => {
  if (!text) return "";
  const words = text.split(" ");
  if (words.length <= wordLimit) return text;
  return words.slice(0, wordLimit).join(" ") + " ...";
};

const ExpandableText = ({ text, limit = 20 }) => {
  const [expanded, setExpanded] = useState(false);

  // Hapus tag HTML pas ditruncate, tapi pas expanded tampil full
  const plainText = text.replace(/<[^>]+>/g, "");

  return (
    <div className="prose prose-sm max-w-none dark:prose-invert">
      <div
        dangerouslySetInnerHTML={{
          __html: expanded ? text : truncateWords(plainText, limit),
        }}
      />
      {plainText.split(" ").length > limit && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-blue-600 text-sm hover:underline ml-1"
        >
          {expanded ? "Sembunyikan" : "Lihat detail"}
        </button>
      )}
    </div>
  );
};

export default ExpandableText;
