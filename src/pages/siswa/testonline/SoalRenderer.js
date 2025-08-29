import React from "react";
import { getOriginalAnswerValue, getOriginalIndex } from "./shuffleUtils"; // Pastikan path sesuai
import LampiranViewer from "./LampiranViewer"; // Sesuaikan path

const SoalRenderer = ({
  soal,
  jawaban,
  onJawab,
  raguRagu,
  onToggleRaguRagu,
  currentIndex,
  totalSoal,
}) => {
  if (!soal) return null;

  const renderSoal = (s) => {
    switch (s.tipe_soal) {
      case "pg":
        const pgPilihan = s.shuffledPilihan || JSON.parse(s.pilihan_jawaban);

        return pgPilihan.map((opt, idx) => {
          const originalValue = getOriginalAnswerValue(s, idx, opt);

          return (
            <div
              key={idx}
              className="flex items-center mb-4 p-3 bg-gray-750 rounded-lg border border-gray-600 hover:bg-gray-700 transition-colors"
            >
              <input
                id={`soal_${s.soal_id}_${idx}`}
                type="radio"
                name={`soal_${s.soal_id}`}
                value={originalValue}
                checked={jawaban[s.soal_id] === originalValue}
                onChange={() => onJawab(s.soal_id, originalValue)}
                className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500 focus:ring-2"
              />
              <label
                htmlFor={`soal_${s.soal_id}_${idx}`}
                className="ms-3 text-white text-sm cursor-pointer flex-1"
                dangerouslySetInnerHTML={{ __html: opt }}
              />
            </div>
          );
        });

      case "pg_kompleks":
        const pgKompleksPilihan =
          s.shuffledPilihan || JSON.parse(s.pilihan_jawaban);
        const currentJawaban = jawaban[s.soal_id] || [];

        return pgKompleksPilihan.map((opt, idx) => {
          const originalValue = getOriginalAnswerValue(s, idx, opt);
          const isChecked = currentJawaban.includes(originalValue);

          return (
            <div
              key={idx}
              className="flex items-center mb-4 p-3 bg-gray-750 rounded-lg border border-gray-600 hover:bg-gray-700 transition-colors"
            >
              <input
                id={`soal_${s.soal_id}_${idx}`}
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
                htmlFor={`soal_${s.soal_id}_${idx}`}
                className="ms-3 text-white text-sm cursor-pointer flex-1"
                dangerouslySetInnerHTML={{ __html: opt }}
              />
            </div>
          );
        });

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
            id="message"
            rows="6"
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={jawaban[s.soal_id] || ""}
            onChange={(e) => onJawab(s.soal_id, e.target.value)}
            placeholder="Tulis Jawaban Disini..."
          />
        );

      case "matching":
        const pairs = s.shuffledPilihan || JSON.parse(s.pilihan_jawaban);
        const rightOptions = pairs.map((item, idx) => ({
          label: String.fromCharCode(65 + idx),
          text: item.right,
          lampiran: item.rightLampiran,
        }));

        return (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Kolom Kiri */}
            <div className="flex-1 space-y-3">
              {pairs.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-gray-750 rounded-lg border border-gray-600"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-3">
                    {/* Teks dan Lampiran Kiri */}
                    <div className="flex-1">
                      <div className="text-white font-medium text-sm mb-2">
                        <span dangerouslySetInnerHTML={{ __html: item.left }} />
                      </div>
                      {/* Tampilkan lampiran kiri jika ada */}
                      {item.leftLampiran && (
                        <div className="mt-2">
                          <LampiranViewer
                            lampiran={item.leftLampiran}
                            altText={`Lampiran kiri ${idx + 1}`}
                            maxWidth="150px"
                            maxHeight="100px"
                          />
                        </div>
                      )}
                    </div>

                    {/* Dropdown Pilihan */}
                    <div className="w-full md:w-32">
                      <select
                        className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 transition-colors"
                        value={jawaban[s.soal_id]?.[item.left] || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          const newJawaban = {
                            ...(jawaban[s.soal_id] || {}),
                            [item.left]: val,
                          };
                          onJawab(s.soal_id, newJawaban);
                        }}
                      >
                        <option value="">-- Pilih --</option>
                        {rightOptions.map((opt) => {
                          const used = Object.values(
                            jawaban[s.soal_id] || {}
                          ).includes(opt.label);
                          return (
                            <option
                              key={opt.label}
                              value={opt.label}
                              disabled={
                                used &&
                                jawaban[s.soal_id]?.[item.left] !== opt.label
                              }
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
              ))}
            </div>

            {/* Kolom Kanan */}
            <div className="flex-1 bg-gray-750 p-4 rounded-lg border border-gray-600">
              <div className="flex flex-col gap-3">
                {rightOptions.map((opt) => (
                  <div key={opt.label} className="p-3 bg-gray-700 rounded">
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-blue-400 text-sm">
                        {opt.label}.
                      </span>
                      <div className="flex-1">
                        {/* Teks kanan */}
                        {opt.text && (
                          <span
                            className="text-white text-sm block mb-2"
                            dangerouslySetInnerHTML={{ __html: opt.text }}
                          />
                        )}

                        {/* Tampilkan lampiran kanan jika ada */}
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
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case "bs":
        const pernyataan =
          soal.shuffledPilihan || JSON.parse(soal.pilihan_jawaban);

        return pernyataan.map((item, idx) => {
          // Dapatkan index asli untuk jawaban yang benar
          const originalIndex = getOriginalIndex(soal, idx);

          return (
            <div
              key={idx}
              className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 p-4 bg-gray-750 rounded-lg border border-gray-600"
            >
              {/* Teks pernyataan */}
              <div className="flex-1 mb-3 md:mb-0 md:mr-4">
                <div
                  className="text-white text-sm md:text-base"
                  dangerouslySetInnerHTML={{ __html: item.teks || item }}
                />
              </div>

              {/* Pilihan benar/salah */}
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <input
                    id={`soal_${soal.soal_id}_${idx}_benar`}
                    type="radio"
                    name={`soal_${soal.soal_id}_${idx}`}
                    value="benar"
                    checked={jawaban[soal.soal_id]?.[originalIndex] === "benar"}
                    onChange={() => {
                      const currentJawaban = jawaban[soal.soal_id] || [];
                      const newJawaban = [...currentJawaban];
                      newJawaban[originalIndex] = "benar";
                      onJawab(soal.soal_id, newJawaban);
                    }}
                    className="w-4 h-4 text-green-600 bg-gray-700 border-gray-600 focus:ring-green-500 focus:ring-2"
                  />
                  <label
                    htmlFor={`soal_${soal.soal_id}_${idx}_benar`}
                    className="ms-2 text-white text-sm cursor-pointer"
                  >
                    Benar
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id={`soal_${soal.soal_id}_${idx}_salah`}
                    type="radio"
                    name={`soal_${soal.soal_id}_${idx}`}
                    value="salah"
                    checked={jawaban[soal.soal_id]?.[originalIndex] === "salah"}
                    onChange={() => {
                      const currentJawaban = jawaban[soal.soal_id] || [];
                      const newJawaban = [...currentJawaban];
                      newJawaban[originalIndex] = "salah";
                      onJawab(soal.soal_id, newJawaban);
                    }}
                    className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 focus:ring-red-500 focus:ring-2"
                  />
                  <label
                    htmlFor={`soal_${soal.soal_id}_${idx}_salah`}
                    className="ms-2 text-white text-sm cursor-pointer"
                  >
                    Salah
                  </label>
                </div>
              </div>
            </div>
          );
        });
      default:
        return (
          <p className="text-red-400 p-4 bg-red-900 rounded">
            Tipe soal tidak dikenali
          </p>
        );
    }
  };

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
          dangerouslySetInnerHTML={{
            __html: soal.pertanyaan,
          }}
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
