// utils/renderKunci.js
import ExpandableText from "../../../../utils/ExpandableText";

// Komponen untuk menampilkan konten HTML dengan rumus dan expandable
const HtmlContentWithMath = ({ html, className = "", isExpandable = true, limit = 25 }) => {
  if (!html || html === "-") return "-";
  
  if (isExpandable) {
    return (
      <div className={`html-content ${className}`}>
        <ExpandableText text={html} limit={limit} />
      </div>
    );
  }
  
  return (
    <div 
      className={`soal-content html-content ${className}`}
      dangerouslySetInnerHTML={{ __html: html }} 
    />
  );
};

// Komponen untuk menampilkan lampiran
const LampiranDisplay = ({ lampiran }) => {
  if (!lampiran) return null;

  const { nama_file, path_file, tipe_file } = lampiran;
  const fullPath = `http://localhost:8080/${path_file.replace(/\\/g, "/")}`;

  if (tipe_file.startsWith("image")) {
    return (
      <img
        src={fullPath}
        alt={nama_file}
        className="w-10 h-10 object-cover rounded border cursor-pointer"
        onClick={() => window.open(fullPath, "_blank")}
        title={nama_file}
      />
    );
  } else {
    return (
      <a
        href={fullPath}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline text-xs"
        title={nama_file}
      >
        📎 {nama_file}
      </a>
    );
  }
};

export function renderKunci(item) {
  try {
    let kunci;
    try {
      kunci = JSON.parse(item.jawaban_benar || "[]");
    } catch {
      kunci = item.jawaban_benar || "";
    }

    let pilihan = [];
    try {
      pilihan = JSON.parse(item.pilihan_jawaban || "[]");
    } catch {
      pilihan = [];
    }

    // Fungsi untuk menghilangkan tag HTML
    const cleanHTML = (html) => {
      if (!html) return "";
      return html.replace(/<[^>]*>/g, '');
    };

    switch (item.tipe_soal) {
      case "pg":
        if (Array.isArray(kunci) && kunci.length > 0) {
          const idx = parseInt(kunci[0]);
          if (!isNaN(idx) && pilihan[idx]) {
            return <span>{cleanHTML(pilihan[idx])}</span>;
          } else {
            return <span className="text-green-600 dark:text-green-400 font-medium">{kunci[0]}</span>;
          }
        }
        return "-";

      case "pg_kompleks":
        if (Array.isArray(kunci) && kunci.length > 0) {
          return (
            <div className="space-y-1">
              {kunci.map((idx, i) => {
                const parsedIdx = parseInt(idx);
                const content = (!isNaN(parsedIdx) && pilihan[parsedIdx]) 
                  ? <span>{cleanHTML(pilihan[parsedIdx])}</span>
                  : <span className="text-green-600 dark:text-green-400 font-medium">{idx}</span>;
                
                return (
                  <div key={i} className="flex items-start">
                    <span className="mr-2 text-green-600 dark:text-green-400 font-medium">{i + 1}.</span>
                    {content}
                  </div>
                );
              })}
            </div>
          );
        }
        return "-";

      // ... cases lainnya tetap sama ...
      case "bs":
        if (Array.isArray(kunci) && kunci.length > 0) {
          return (
            <div className="space-y-2">
              {kunci.map((val, i) => {
                const pernyataan = pilihan[i]?.teks || `Pernyataan ${i + 1}`;
                const isBenar = val === "benar";
                return (
                  <div key={i} className="flex items-center justify-between">
                    <span>{cleanHTML(pernyataan)}</span>
                    <span className={`ml-3 px-2 py-1 rounded text-xs font-medium ${
                      isBenar 
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" 
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                    }`}>
                      {isBenar ? "BENAR" : "SALAH"}
                    </span>
                  </div>
                );
              })}
            </div>
          );
        }
        return "-";

      case "matching":
        if (Array.isArray(kunci) && kunci.length > 0) {
          return (
            <div className="space-y-2">
              {kunci.map((pair, index) => (
                <div key={index} className="flex items-center">
                  <span>{cleanHTML(pair.left || "")}</span>
                  <span className="mx-3 text-gray-500 dark:text-gray-400">→</span>
                  {pair.rightLampiran ? (
                    <LampiranDisplay lampiran={pair.rightLampiran} />
                  ) : (
                    <span>{cleanHTML(pair.right || "")}</span>
                  )}
                </div>
              ))}
            </div>
          );
        }
        return "-";

      case "uraian":
      case "isian_singkat":
        return <span className="text-gray-400 dark:text-gray-500 italic">Tidak tersedia</span>;

      default:
        return "-";
    }
  } catch (e) {
    console.error("Error rendering kunci:", e, item);
    return "-";
  }
}

export function renderJawaban(item) {
  try {
    let jawaban;
    try {
      jawaban = JSON.parse(item.jawaban_siswa || "[]");
    } catch {
      jawaban = item.jawaban_siswa || "";
    }

    let pilihan = [];
    try {
      pilihan = JSON.parse(item.pilihan_jawaban || "[]");
    } catch {
      pilihan = [];
    }

    // Fungsi untuk menghilangkan tag HTML
    const cleanHTML = (html) => {
      if (!html) return "";
      return html.replace(/<[^>]*>/g, '');
    };

    if (typeof jawaban === "string") {
      return <span>{cleanHTML(jawaban)}</span>;
    }

    if (!jawaban || (Array.isArray(jawaban) && jawaban.length === 0)) {
      return <span className="text-gray-400 dark:text-gray-500 italic">Tidak dijawab</span>;
    }

    switch (item.tipe_soal) {
      case "pg":
        if (Array.isArray(jawaban) && jawaban.length > 0) {
          const val = jawaban[0];
          const idx = parseInt(val);
          if (!isNaN(idx) && pilihan[idx]) {
            return <span>{cleanHTML(pilihan[idx])}</span>;
          }
          return <span className="text-blue-600 dark:text-blue-400 font-medium">{cleanHTML(val)}</span>;
        }
        return "-";

      case "pg_kompleks":
        if (Array.isArray(jawaban) && jawaban.length > 0) {
          return (
            <div className="space-y-1">
              {jawaban.map((val, i) => {
                const idx = parseInt(val);
                const content = (!isNaN(idx) && pilihan[idx]) 
                  ? <span>{cleanHTML(pilihan[idx])}</span>
                  : <span className="text-blue-600 dark:text-blue-400 font-medium">{cleanHTML(val)}</span>;
                
                return (
                  <div key={i} className="flex items-start">
                    <span className="mr-2 text-blue-600 dark:text-blue-400 font-medium">{i + 1}.</span>
                    {content}
                  </div>
                );
              })}
            </div>
          );
        }
        return "-";

      case "bs":
        if (Array.isArray(jawaban) && jawaban.length > 0) {
          // Urutkan berdasarkan index
          const sortedJawaban = [...jawaban].sort((a, b) => a.index - b.index);
          return (
            <div className="space-y-2">
              {sortedJawaban.map((ans, i) => {
                const pernyataan = pilihan[ans.index]?.teks || `Pernyataan ${ans.index + 1}`;
                const isBenar = ans.jawaban === "benar";
                return (
                  <div key={i} className="flex items-center justify-between">
                    <span>{cleanHTML(pernyataan)}</span>
                    <span className={`ml-3 px-2 py-1 rounded text-xs font-medium ${
                      isBenar 
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" 
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                    }`}>
                      {isBenar ? "BENAR" : "SALAH"}
                    </span>
                  </div>
                );
              })}
            </div>
          );
        }
        return "-";

      case "matching":
        if (Array.isArray(jawaban) && jawaban.length > 0) {
          // URUTKAN berdasarkan leftIndex agar sesuai urutan
          const sortedJawaban = [...jawaban].sort((a, b) => a.leftIndex - b.leftIndex);
          return (
            <div className="space-y-2">
              {sortedJawaban.map((map, index) => {
                const leftItem = pilihan[map.leftIndex];
                const rightItem = pilihan[map.rightIndex];
                return (
                  <div key={index} className="flex items-center">
                    <span>{cleanHTML(leftItem?.left || "")}</span>
                    <span className="mx-3 text-gray-500 dark:text-gray-400">→</span>
                    {rightItem?.rightLampiran ? (
                      <LampiranDisplay lampiran={rightItem.rightLampiran} />
                    ) : (
                      <span>{cleanHTML(rightItem?.right || "")}</span>
                    )}
                  </div>
                );
              })}
            </div>
          );
        }
        return "-";

      case "uraian":
      case "isian_singkat":
        return <span>{cleanHTML(String(jawaban))}</span>;

      default:
        return <span>{cleanHTML(String(jawaban))}</span>;
    }
  } catch (e) {
    console.error("Error rendering jawaban:", e, item);
    return "-";
  }
}