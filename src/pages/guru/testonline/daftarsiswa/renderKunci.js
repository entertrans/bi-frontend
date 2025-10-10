// utils/renderKunci.js
import ExpandableText from "../../../../utils/ExpandableText";

// Komponen untuk menampilkan konten HTML dengan rumus dan expandable
const HtmlContentWithMath = ({
  html,
  className = "",
  isExpandable = true,
  limit = 25,
}) => {
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
        className=" hover:underline text-xs"
        title={nama_file}
      >
        📎 {nama_file}
      </a>
    );
  }
};

const cleanHTML = (html) => {
    if (!html) return "";
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
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

    // Fungsi helper untuk mengekstrak teks dari HTML
    const extractTextFromHtml = (html) => {
      if (!html) return "";
      // Jika sudah berupa teks biasa, return langsung
      if (typeof html === "string" && !html.includes("<")) return html;

      // Buat element sementara untuk mengekstrak teks
      const temp = document.createElement("div");
      temp.innerHTML = html;
      return temp.textContent || temp.innerText || html;
    };

    // Fungsi helper untuk render content
    const renderContent = (content, isKunci = true) => {
      const textContent = extractTextFromHtml(content);
      const colorClass = isKunci
        ? " dark: font-medium"
        : " dark: font-medium";

      // Jika content sudah berupa HTML yang valid, render dengan HtmlContentWithMath
      if (
        typeof content === "string" &&
        (content.includes("<") || content.includes("$$"))
      ) {
        return <HtmlContentWithMath html={content} />;
      }
      // Jika hanya teks biasa, tampilkan dengan span
      return <span className={colorClass}>{textContent}</span>;
    };

    switch (item.tipe_soal) {
      case "pg":
        if (Array.isArray(kunci) && kunci.length > 0) {
          const idx = parseInt(kunci[0]);
          if (!isNaN(idx) && pilihan[idx]) {
            return renderContent(pilihan[idx], true);
          } else {
            return renderContent(kunci[0], true);
          }
        }
        return "-";

      case "pg_kompleks":
        if (Array.isArray(kunci) && kunci.length > 0) {
          return (
            <div className="space-y-1">
              {kunci.map((idx, i) => {
                const parsedIdx = parseInt(idx);
                const content =
                  !isNaN(parsedIdx) && pilihan[parsedIdx]
                    ? renderContent(pilihan[parsedIdx], true)
                    : renderContent(idx, true);

                return (
                  <div key={i} className="flex items-start">
                    <span className="mr-2  dark: font-medium">
                      {i + 1}.
                    </span>
                    {content}
                  </div>
                );
              })}
            </div>
          );
        }
        return "-";

      case "bs":
        if (Array.isArray(kunci) && kunci.length > 0) {
          return (
            <div className="space-y-2">
              {kunci.map((val, i) => {
                const pernyataan = pilihan[i]?.teks || `Pernyataan ${i + 1}`;
                const isBenar = val === "benar";
                return (
                  <div key={i} className="flex items-center justify-between">
                    <HtmlContentWithMath html={pernyataan} />
                    <span
                      className={`ml-3 px-2 py-1 rounded text-xs font-medium ${
                        isBenar
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                      }`}
                    >
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
                  <HtmlContentWithMath html={pair.left || ""} />
                  <span className="mx-3 text-gray-500 dark:text-gray-400">
                    →
                  </span>
                  {pair.rightLampiran ? (
                    <LampiranDisplay lampiran={pair.rightLampiran} />
                  ) : (
                    <HtmlContentWithMath html={pair.right || ""} />
                  )}
                </div>
              ))}
            </div>
          );
        }
        return "-";

      case "uraian":
      case "isian_singkat":
        return (
          <span className="text-gray-400 dark:text-gray-500 italic">
            Tidak tersedia
          </span>
        );

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

    // Fungsi helper untuk mengekstrak teks dari HTML
    const extractTextFromHtml = (html) => {
      if (!html) return "";
      // Jika sudah berupa teks biasa, return langsung
      if (typeof html === "string" && !html.includes("<")) return html;

      // Buat element sementara untuk mengekstrak teks
      const temp = document.createElement("div");
      temp.innerHTML = html;
      return temp.textContent || temp.innerText || html;
    };

    // Fungsi helper untuk render content jawaban
    const renderJawabanContent = (content) => {
      const textContent = extractTextFromHtml(content);

      // Jika content sudah berupa HTML yang valid, render dengan HtmlContentWithMath
      if (
        typeof content === "string" &&
        (content.includes("<") || content.includes("$$"))
      ) {
        return <HtmlContentWithMath html={content} />;
      }
      // Jika hanya teks biasa, tampilkan dengan span
      return <span className=" dark: font-medium">{textContent}</span>;
    };

    if (typeof jawaban === "string") {
      return renderJawabanContent(jawaban);
    }

    if (!jawaban || (Array.isArray(jawaban) && jawaban.length === 0)) {
      return (
        <span className="text-gray-400 dark:text-gray-500 italic">
          Tidak dijawab
        </span>
      );
    }

    switch (item.tipe_soal) {
      case "pg":
        if (Array.isArray(jawaban) && jawaban.length > 0) {
          const val = jawaban[0];
          const idx = parseInt(val);
          if (!isNaN(idx) && pilihan[idx]) {
            return renderJawabanContent(pilihan[idx]);
          }
          return renderJawabanContent(val);
        }
        return "-";

      case "pg_kompleks":
        if (Array.isArray(jawaban) && jawaban.length > 0) {
          return (
            <div className="space-y-1">
              {jawaban.map((val, i) => {
                const idx = parseInt(val);
                const content =
                  !isNaN(idx) && pilihan[idx]
                    ? renderJawabanContent(pilihan[idx])
                    : renderJawabanContent(val);

                return (
                  <div key={i} className="flex items-start">
                    <span className="mr-2  dark: font-medium">{i + 1}.</span>
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
          return (
            <div className="space-y-2">
              {jawaban.map((ans, i) => {
                const pernyataan =
                  pilihan[ans.index]?.teks || `Pernyataan ${ans.index + 1}`;
                const isBenar = ans.jawaban === "benar";
                return (
                  <div key={i} className="flex items-center justify-between">
                    <HtmlContentWithMath html={pernyataan} />
                    <span
                      className={`ml-3 px-2 py-1 rounded text-xs font-medium ${
                        isBenar
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                      }`}
                    >
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
    // Parse jawaban_benar untuk mendapatkan urutan yang benar
    let kunciMatching = [];
    try {
      kunciMatching = JSON.parse(item.jawaban_benar || "[]");
    } catch {
      kunciMatching = [];
    }

    // Buat array hasil yang diurutkan berdasarkan urutan kunci
    const hasilDiurutkan = [];
    
    // Untuk setiap item di kunci (urutan yang benar), cari jawaban siswa yang sesuai
    kunciMatching.forEach((kunciItem) => {
      // Cari jawaban siswa yang leftIndex-nya sama dengan kunci
      const jawabanSiswa = jawaban.find(j => j.leftIndex === kunciItem.leftIndex);
      
      if (jawabanSiswa) {
        hasilDiurutkan.push({
          leftIndex: kunciItem.leftIndex,  // Gunakan leftIndex dari kunci untuk urutan
          rightIndex: jawabanSiswa.rightIndex, // Tapi rightIndex dari jawaban siswa
          leftText: kunciItem.left // Teks kiri dari kunci
        });
      }
    });

    // Jika ada jawaban siswa yang tidak match dengan kunci, tambahkan di akhir
    jawaban.forEach(j => {
      if (!hasilDiurutkan.find(item => item.leftIndex === j.leftIndex)) {
        const kunciItem = kunciMatching.find(k => k.leftIndex === j.leftIndex);
        hasilDiurutkan.push({
          leftIndex: j.leftIndex,
          rightIndex: j.rightIndex,
          leftText: kunciItem?.left || `Item ${j.leftIndex + 1}`
        });
      }
    });

    return (
      <div className="space-y-2">
        {hasilDiurutkan.map((map, index) => {
          const leftItem = pilihan[map.leftIndex];
          const rightItem = pilihan[map.rightIndex]; // rightIndex dari jawaban siswa
          
          return (
            <div key={index} className="flex items-center">
              <span>{cleanHTML(map.leftText || leftItem?.left || "")}</span>
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
        return renderJawabanContent(String(jawaban));

      default:
        return renderJawabanContent(String(jawaban));
    }
  } catch (e) {
    console.error("Error rendering jawaban:", e, item);
    return "-";
  }
}
