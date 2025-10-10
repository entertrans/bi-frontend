import { useState } from "react";

function cleanHtml(html) {
  if (typeof html !== "string") return html;
  return html
    .replace(/<p[^>]*>(.*?)<\/p>/gi, "$1") // ambil isi dalam <p>...</p>
    .replace(/&nbsp;/gi, " ")
    .trim();
}

const truncateWords = (html, wordLimit = 20) => {
  if (!html) return "";

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;

  // Hapus gambar rumus base64 untuk preview
  const images = tempDiv.getElementsByTagName("img");
  for (let i = images.length - 1; i >= 0; i--) {
    if (images[i].src.includes("data:image/png;base64")) {
      images[i].parentNode.removeChild(images[i]);
    }
  }

  const plainText = tempDiv.textContent || tempDiv.innerText || "";
  const words = plainText.trim().split(/\s+/);

  if (words.length <= wordLimit) {
    return plainText;
  }

  return words.slice(0, wordLimit).join(" ") + " ...";
};

const ExpandableText = ({ text, limit = 100 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // ✅ bersihkan HTML sebelum render
  const cleanedText = cleanHtml(String(text || ""));

  const shouldTruncate = cleanedText.length > limit;
  const displayText =
    isExpanded || !shouldTruncate
      ? cleanedText
      : cleanedText.substring(0, limit) + "...";

  return (
    <div className="expandable-text">
      <div dangerouslySetInnerHTML={{ __html: displayText }} />
      {shouldTruncate && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 hover:text-blue-800 text-sm mt-1 focus:outline-none"
        >
          {isExpanded ? "Tutup" : "Baca Selengkapnya"}
        </button>
      )}
    </div>
  );
};

export default ExpandableText;
