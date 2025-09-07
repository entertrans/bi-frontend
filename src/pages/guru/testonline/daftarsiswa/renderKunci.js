// utils/renderKunci.js

// helper untuk hilangkan html tags
function stripHtml(html) {
  if (!html) return "-";
  return html.replace(/<[^>]*>/g, "").trim();
}

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
        return stripHtml(pilihan[parseInt(kunci[0])] || "-");

      case "pg_kompleks":
        return (
          <div className="space-y-1">
            {kunci.map((idx, i) => (
              <div key={i}>
                {i + 1} | {stripHtml(pilihan[parseInt(idx)] || "-")}
              </div>
            ))}
          </div>
        );

      case "bs":
        return kunci
          .map((val, i) => `[${val}] ${stripHtml(pilihan[i]?.teks)}`)
          .join(" | ");

      case "matching":
        return (
          <div className="space-y-1">
            {pilihan.map((pair, index) => (
              <div key={index} className="flex items-center">
                <span className="mr-2">{stripHtml(pair.left)} →</span>
                {pair.rightLampiran ? (
                  <LampiranDisplay lampiran={pair.rightLampiran} />
                ) : (
                  <span>{stripHtml(pair.right) || "-"}</span>
                )}
              </div>
            ))}
          </div>
        );

      case "uraian":
      case "isian_singkat":
        return "-"; // biasanya kunci uraian/isian kosong

      default:
        return "-";
    }
  } catch (e) {
    return "-";
  }
}

export function renderJawaban(item) {
  try {
    const pilihan = JSON.parse(item.pilihan_jawaban || "[]");
    let jawaban = JSON.parse(item.jawaban_siswa || "[]");

    switch (item.tipe_soal) {
      case "pg":
        // jawaban siswa kadang langsung teks HTML
        if (typeof jawaban[0] === "string") {
          return stripHtml(jawaban[0]);
        }
        return stripHtml(pilihan[parseInt(jawaban[0])] || "-");

      case "pg_kompleks":
        return (
          <div className="space-y-1">
            {jawaban.map((val, i) => {
              let teksJawaban;

              if (typeof val === "string" && isNaN(val)) {
                teksJawaban = stripHtml(val);
              } else {
                teksJawaban = stripHtml(pilihan[parseInt(val)] || val);
              }

              return (
                <div key={i}>
                  {i + 1} | {teksJawaban}
                </div>
              );
            })}
          </div>
        );

      case "bs":
        // urutkan berdasarkan index
        jawaban = jawaban.sort((a, b) => a.index - b.index);
        return jawaban
          .map(
            (ans) => `[${ans.jawaban}] ${stripHtml(pilihan[ans.index]?.teks)}`
          )
          .join(" | ");

      case "matching":
        // urutkan berdasarkan leftIndex
        jawaban = jawaban.sort((a, b) => a.leftIndex - b.leftIndex);
        return (
          <div className="space-y-1">
            {jawaban.map((map, index) => {
              const pilihanKanan = pilihan[map.rightIndex];
              return (
                <div key={index} className="flex items-center">
                  <span className="mr-2">
                    {stripHtml(pilihan[map.leftIndex]?.left)} →
                  </span>
                  {pilihanKanan?.rightLampiran ? (
                    <LampiranDisplay lampiran={pilihanKanan.rightLampiran} />
                  ) : (
                    <span>{stripHtml(pilihanKanan?.right) || "-"}</span>
                  )}
                </div>
              );
            })}
          </div>
        );

      case "uraian":
      case "isian_singkat":
        return stripHtml(item.jawaban_siswa);

      default:
        return "-";
    }
  } catch (e) {
    return "-";
  }
}
