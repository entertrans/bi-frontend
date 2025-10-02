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
    const pilihan = JSON.parse(item.pilihan_jawaban || "[]");
    const kunci = JSON.parse(item.jawaban_benar || "[]");

    switch (item.tipe_soal) {
      case "pg":
        return <HtmlContentWithMath html={pilihan[parseInt(kunci[0])] || "-"} />;

      case "pg_kompleks":
        return (
          <div className="space-y-1">
            {kunci.map((idx, i) => (
              <div key={i} className="flex items-start">
                <span className="mr-2 min-w-[20px]">{i + 1}.</span>
                <HtmlContentWithMath 
                  html={pilihan[parseInt(idx)] || "-"} 
                  limit={15} // Limit lebih kecil untuk pilihan ganda kompleks
                />
              </div>
            ))}
          </div>
        );

      case "bs":
        return (
          <div className="space-y-1">
            {kunci.map((val, i) => (
              <div key={i} className="flex items-center">
                <span className="mr-2 font-mono">[{val}]</span>
                <HtmlContentWithMath html={pilihan[i]?.tejs} limit={10} />
              </div>
            ))}
          </div>
        );

      case "matching":
        return (
          <div className="space-y-1">
            {pilihan.map((pair, index) => (
              <div key={index} className="flex items-center">
                <span className="mr-2">
                  <HtmlContentWithMath html={pair.left} limit={8} /> →
                </span>
                {pair.rightLampiran ? (
                  <LampiranDisplay lampiran={pair.rightLampiran} />
                ) : (
                  <HtmlContentWithMath html={pair.right} limit={8} />
                )}
              </div>
            ))}
          </div>
        );

      case "uraian":
      case "isian_singkat":
        return "-"; // kunci uraian/isian biasanya kosong

      default:
        return "-";
    }
  } catch (e) {
    console.error("Error rendering kunci:", e);
    return "-";
  }
}

export function renderJawaban(item) {
  try {
    const pilihan = JSON.parse(item.pilihan_jawaban || "[]");
    let jawaban = JSON.parse(item.jawaban_siswa || "[]");

    // Handle case where jawaban_siswa is a string (for uraian/isian_singkat)
    if (typeof jawaban === 'string') {
      return <HtmlContentWithMath html={jawaban} />;
    }

    switch (item.tipe_soal) {
      case "pg":
        if (typeof jawaban[0] === "string") {
          return <HtmlContentWithMath html={jawaban[0]} />;
        }
        return <HtmlContentWithMath html={pilihan[parseInt(jawaban[0])] || "-"} />;

      case "pg_kompleks":
        return (
          <div className="space-y-1">
            {jawaban.map((val, i) => {
              let content;
              if (typeof val === "string" && isNaN(val)) {
                content = <HtmlContentWithMath html={val} limit={15} />;
              } else {
                content = <HtmlContentWithMath html={pilihan[parseInt(val)] || val} limit={15} />;
              }
              return (
                <div key={i} className="flex items-start">
                  <span className="mr-2 min-w-[20px]">{i + 1}.</span>
                  {content}
                </div>
              );
            })}
          </div>
        );

      case "bs":
        jawaban = jawaban.sort((a, b) => a.index - b.index);
        return (
          <div className="space-y-1">
            {jawaban.map((ans, i) => (
              <div key={i} className="flex items-center">
                <span className="mr-2 font-mono">[{ans.jawaban}]</span>
                <HtmlContentWithMath html={pilihan[ans.index]?.teks} limit={10} />
              </div>
            ))}
          </div>
        );

      case "matching":
        jawaban = jawaban.sort((a, b) => a.leftIndex - b.leftIndex);
        return (
          <div className="space-y-1">
            {jawaban.map((map, index) => {
              const pilihanKanan = pilihan[map.rightIndex];
              return (
                <div key={index} className="flex items-center">
                  <span className="mr-2">
                    <HtmlContentWithMath html={pilihan[map.leftIndex]?.left} limit={8} /> →
                  </span>
                  {pilihanKanan?.rightLampiran ? (
                    <LampiranDisplay lampiran={pilihanKanan.rightLampiran} />
                  ) : (
                    <HtmlContentWithMath html={pilihanKanan?.right} limit={8} />
                  )}
                </div>
              );
            })}
          </div>
        );

      case "uraian":
      case "isian_singkat":
        // Untuk uraian dan isian singkat, gunakan expandable dengan limit default
        return <HtmlContentWithMath html={item.jawaban_siswa} />;

      default:
        return "-";
    }
  } catch (e) {
    console.error("Error rendering jawaban:", e);
    return "-";
  }
}