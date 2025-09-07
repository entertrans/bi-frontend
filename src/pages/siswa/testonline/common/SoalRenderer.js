import React from "react";
import { getOriginalAnswerValue, getOriginalIndex } from "./shuffleUtils";
import LampiranViewer from "./LampiranViewer";

const SoalRenderer = ({
  soal,
  jawaban,
  onJawab,
  raguRagu,
  onToggleRaguRagu,
  currentIndex,
  totalSoal,
}) => {
  // Jangan return sebelum hooks — di sini kita nggak pakai hooks sama sekali,
  // jadi aman, tapi tetap cek null setelah deklarasi fungsi.
  const safeParse = (v) => {
    try {
      return typeof v === "string" ? JSON.parse(v) : v || [];
    } catch {
      return [];
    }
  };

  const renderSoal = (s) => {
    switch (s.tipe_soal) {
      case "pg": {
        const pgPilihan = s.shuffledPilihan || safeParse(s.pilihan_jawaban);
        return pgPilihan.map((opt, idx) => {
          const originalValue = getOriginalAnswerValue(s, idx, opt);
          const name = `soal_${s.soal_id}`;
          const id = `soal_${s.soal_id}_${idx}`;
          return (
            <div
              key={idx}
              className="flex items-center mb-4 p-3 bg-gray-750 rounded-lg border border-gray-600 hover:bg-gray-700 transition-colors"
            >
              <input
                id={id}
                type="radio"
                name={name}
                value={originalValue}
                checked={(jawaban[s.soal_id] || []).includes(originalValue)} // ✅ pakai includes
                onChange={() => onJawab(s.soal_id, [originalValue])} // ✅ simpan array [val]
                className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500 focus:ring-2"
              />

              <label
                htmlFor={id}
                className="ms-3 text-white text-sm cursor-pointer flex-1"
                dangerouslySetInnerHTML={{ __html: opt }}
              />
            </div>
          );
        });
      }

      case "pg_kompleks": {
        const pgKompleksPilihan =
          s.shuffledPilihan || safeParse(s.pilihan_jawaban);
        const currentJawaban = jawaban[s.soal_id] || [];
        return pgKompleksPilihan.map((opt, idx) => {
          const originalValue = getOriginalAnswerValue(s, idx, opt);
          const isChecked = currentJawaban.includes(originalValue);
          const id = `soal_${s.soal_id}_${idx}`;
          return (
            <div
              key={idx}
              className="flex items-center mb-4 p-3 bg-gray-750 rounded-lg border border-gray-600 hover:bg-gray-700 transition-colors"
            >
              <input
                id={id}
                type="checkbox"
                name={`soal_${s.soal_id}`}
                value={originalValue}
                checked={isChecked}
                onChange={(e) => {
                  const newVal = e.target.checked
                    ? [...currentJawaban, originalValue]
                    : currentJawaban.filter((v) => v !== originalValue);
                  onJawab(s.soal_id, newVal);
                }}
                className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label
                htmlFor={id}
                className="ms-3 text-white text-sm cursor-pointer flex-1"
                dangerouslySetInnerHTML={{ __html: opt }}
              />
            </div>
          );
        });
      }

      case "isian_singkat":
        return (
          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={jawaban[s.soal_id] || ""}
            onChange={(e) => onJawab(s.soal_id, e.target.value)}
            placeholder="Ketik jawaban Anda di sini..."
          />
        );

      case "uraian":
        return (
          <textarea
            rows="6"
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={jawaban[s.soal_id] || ""}
            onChange={(e) => onJawab(s.soal_id, e.target.value)}
            placeholder="Tulis Jawaban Disini..."
          />
        );

      case "matching": {
        const pairs = s.shuffledPilihan || safeParse(s.pilihan_jawaban);

        // Pastikan mapping ada dan lengkap
        const leftMap = s.shuffledToOriginalMap?.left || {};
        const rightMap = s.shuffledToOriginalMap?.right || {};

        const rightOptions = pairs.map((item, shuffledRightIdx) => {
          const originalIndex = rightMap[shuffledRightIdx] ?? shuffledRightIdx;
          return {
            label: String.fromCharCode(65 + shuffledRightIdx),
            text: item.right,
            lampiran: item.rightLampiran,
            originalIndex: originalIndex,
            shuffledIndex: shuffledRightIdx,
          };
        });

        const current = jawaban[s.soal_id] || [];

        return (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Kolom Kiri */}
            <div className="flex-1 space-y-3">
              {pairs.map((item, shuffledLeftIdx) => {
                const leftOriginalIdx =
                  leftMap[shuffledLeftIdx] ?? shuffledLeftIdx;
                const name = `soal_${s.soal_id}_${leftOriginalIdx}`;

                // Cari jawaban untuk left ini
                const currentAnswer = current.find(
                  (c) => c.leftIndex === leftOriginalIdx
                );
                const currentRightOriginalIdx = currentAnswer?.rightIndex;

                // Cari label untuk right yang dipilih
                let currentRightLabel = "";
                if (currentRightOriginalIdx !== undefined) {
                  // Cari shuffled index dari right yang dipilih
                  const rightShuffledIdx = Object.keys(rightMap).find(
                    (key) => rightMap[key] === currentRightOriginalIdx
                  );

                  if (rightShuffledIdx !== undefined) {
                    currentRightLabel =
                      rightOptions[rightShuffledIdx]?.label || "";
                  }
                }

                return (
                  <div
                    key={shuffledLeftIdx}
                    className="p-4 bg-gray-750 rounded-lg border border-gray-600"
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-3">
                      <div className="flex-1">
                        <div className="text-white font-medium text-sm mb-2">
                          <span
                            dangerouslySetInnerHTML={{ __html: item.left }}
                          />
                        </div>
                        {item.leftLampiran && (
                          <div className="mt-2">
                            <LampiranViewer
                              lampiran={item.leftLampiran}
                              altText={`Lampiran kiri ${shuffledLeftIdx + 1}`}
                              maxWidth="150px"
                              maxHeight="100px"
                            />
                          </div>
                        )}
                      </div>

                      <div className="w-full md:w-32">
                        <select
                          name={name}
                          className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
                          value={currentRightLabel}
                          onChange={(e) => {
                            const rightLabel = e.target.value;

                            if (!rightLabel) {
                              // reset → hapus jawaban untuk left ini
                              const next = current.filter(
                                (c) => c.leftIndex !== leftOriginalIdx
                              );
                              onJawab(s.soal_id, next);
                              return;
                            }

                            // Cari rightShuffledIdx berdasarkan label
                            const rightShuffledIdx = rightOptions.findIndex(
                              (opt) => opt.label === rightLabel
                            );

                            if (rightShuffledIdx === -1) return;

                            const rightOriginalIdx =
                              rightOptions[rightShuffledIdx]?.originalIndex;

                            const mapped = {
                              leftIndex: leftOriginalIdx,
                              rightIndex: rightOriginalIdx,
                            };

                            const next = [
                              ...current.filter(
                                (c) => c.leftIndex !== leftOriginalIdx
                              ),
                              mapped,
                            ];
                            onJawab(s.soal_id, next);
                          }}
                        >
                          <option value="">-- Pilih --</option>
                          {rightOptions.map((opt) => {
                            // Cek apakah opsi ini sudah dipakai oleh left lain
                            const sudahDipakai = current.some(
                              (c) =>
                                c.rightIndex === opt.originalIndex &&
                                c.leftIndex !== leftOriginalIdx
                            );

                            // Jika sudah dipakai dan bukan oleh left yang sedang diproses, sembunyikan
                            if (
                              sudahDipakai &&
                              currentRightOriginalIdx !== opt.originalIndex
                            ) {
                              return null;
                            }

                            return (
                              <option
                                key={opt.label}
                                value={opt.label}
                                className="text-white bg-gray-800"
                              >
                                {opt.label}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Kolom Kanan */}
            <div className="flex-1 bg-gray-750 p-4 rounded-lg border border-gray-600">
              <div className="flex flex-col gap-3">
                {rightOptions.map((opt) => {
                  const sudahDipakai = current.some(
                    (c) => c.rightIndex === opt.originalIndex
                  );

                  return (
                    <div
                      key={opt.label}
                      className={`p-3 rounded ${
                        sudahDipakai ? "bg-green-900" : "bg-gray-700"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span className="font-bold text-blue-400 text-sm">
                          {opt.label}.
                        </span>
                        <div className="flex-1">
                          {opt.text && (
                            <span
                              className="text-white text-sm block mb-2"
                              dangerouslySetInnerHTML={{ __html: opt.text }}
                            />
                          )}
                          {opt.lampiran && (
                            <div>
                              <LampiranViewer
                                lampiran={opt.lampiran}
                                altText={`Lampiran ${opt.label}`}
                                maxWidth="150px"
                                maxHeight="100px"
                              />
                            </div>
                          )}
                        </div>
                        {sudahDipakai && (
                          <span className="text-green-400 text-xs">
                            ✓ Terpakai
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      }

      case "bs": {
        const pernyataan = s.shuffledPilihan || safeParse(s.pilihan_jawaban);
        const current = jawaban[s.soal_id] || [];
        // console.log("=== DEBUG BS ===");
        // console.log("Pernyataan:", pernyataan);
        // console.log("Current Jawaban:", current);
        // console.log("ShuffledToOriginalMap:", s.shuffledToOriginalMap);
        return pernyataan.map((item, shuffledIndex) => {
          // Dapatkan index asli dari mapping shuffle
          const originalIndex = getOriginalIndex(s, shuffledIndex);

          // Buat key yang benar-benar unik dengan kombinasi soal_id dan originalIndex
          const uniqueKey = `soal_${s.soal_id}_${originalIndex}`;

          // Buat name yang unik untuk setiap pernyataan
          const displayName = `soal_${s.soal_id}_pernyataan_${originalIndex}`;

          // Cari jawaban untuk pernyataan ini berdasarkan index asli
          const currentAnswer = current.find(
            (c) => c.index === originalIndex
          )?.jawaban;
          // console.log(
          //   `ShuffledIndex: ${shuffledIndex} -> OriginalIndex: ${originalIndex}, Answer: ${currentAnswer}`
          // );
          return (
            <div
              key={uniqueKey} // PASTIKAN KEY UNIK
              className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 p-4 bg-gray-750 rounded-lg border border-gray-600"
            >
              <div className="flex-1 mb-3 md:mb-0 md:mr-4">
                <div
                  className="text-white text-sm md:text-base"
                  dangerouslySetInnerHTML={{ __html: item.teks || item }}
                />
              </div>

              <div className="flex space-x-4">
                <div className="flex items-center">
                  <input
                    id={`${displayName}_benar`}
                    type="radio"
                    name={displayName}
                    value="benar"
                    checked={currentAnswer === "benar"}
                    onChange={() => {
                      const mapped = { index: originalIndex, jawaban: "benar" };
                      const next = [
                        ...current.filter((c) => c.index !== originalIndex),
                        mapped,
                      ];
                      onJawab(s.soal_id, next);
                    }}
                    className="w-4 h-4 text-green-600 bg-gray-700 border-gray-600 focus:ring-green-500 focus:ring-2"
                  />
                  <label
                    htmlFor={`${displayName}_benar`}
                    className="ms-2 text-white text-sm cursor-pointer"
                  >
                    Benar
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id={`${displayName}_salah`}
                    type="radio"
                    name={displayName}
                    value="salah"
                    checked={currentAnswer === "salah"}
                    onChange={() => {
                      const mapped = { index: originalIndex, jawaban: "salah" };
                      const next = [
                        ...current.filter((c) => c.index !== originalIndex),
                        mapped,
                      ];
                      onJawab(s.soal_id, next);
                    }}
                    className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 focus:ring-red-500 focus:ring-2"
                  />
                  <label
                    htmlFor={`${displayName}_salah`}
                    className="ms-2 text-white text-sm cursor-pointer"
                  >
                    Salah
                  </label>
                </div>
              </div>
            </div>
          );
        });
      }

      default:
        return (
          <p className="text-red-400 p-4 bg-red-900 rounded">
            Tipe soal tidak dikenali
          </p>
        );
    }
  };

  if (!soal) return null;

  return (
    <div className="p-6 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 mb-6">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-700">
        <div>
          <p className="font-semibold text-lg text-blue-400">
            Soal {currentIndex + 1} dari {totalSoal}
          </p>
        </div>
        <button
          onClick={() => onToggleRaguRagu(soal.soal_id)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            raguRagu[soal.soal_id]
              ? "bg-yellow-500 text-black shadow-lg"
              : "bg-gray-700 text-white hover:bg-yellow-500 hover:text-black"
          }`}
        >
          {raguRagu[soal.soal_id] ? "✓ Ragu-Ragu" : "⚠ Tandai Ragu-Ragu"}
        </button>
      </div>

      <div className="mb-6 p-4 bg-gray-750 rounded-lg border border-gray-600">
        <div
          className="text-white text-lg leading-relaxed prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: soal.pertanyaan }}
        />
        {soal.lampiran && (
          <div className="mt-4">
            <LampiranViewer
              lampiran={soal.lampiran}
              altText={`Lampiran soal ${currentIndex + 1}`}
              maxWidth="300px"
              maxHeight="200px"
            />
          </div>
        )}
      </div>

      <div className="space-y-4">{renderSoal(soal)}</div>
    </div>
  );
};

export default SoalRenderer;
