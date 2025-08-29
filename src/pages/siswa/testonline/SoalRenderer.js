import React from "react";

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
        return JSON.parse(s.pilihan_jawaban).map((opt, idx) => (
          <div
            key={idx}
            className="flex items-center mb-4 p-3 bg-gray-750 rounded-lg border border-gray-600 hover:bg-gray-700 transition-colors"
          >
            <input
              id={`soal_${s.soal_id}_${idx}`}
              type="radio"
              name={`soal_${s.soal_id}`}
              value={opt}
              checked={jawaban[s.soal_id] === opt}
              onChange={() => onJawab(s.soal_id, opt)}
              className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500 focus:ring-2"
            />
            <label
              htmlFor={`soal_${s.soal_id}_${idx}`}
              className="ms-3 text-white text-sm cursor-pointer flex-1"
              dangerouslySetInnerHTML={{ __html: opt }}
            />
          </div>
        ));

      case "pg_kompleks":
        return JSON.parse(s.pilihan_jawaban).map((opt, idx) => (
          <div
            key={idx}
            className="flex items-center mb-4 p-3 bg-gray-750 rounded-lg border border-gray-600 hover:bg-gray-700 transition-colors"
          >
            <input
              id={`soal_${s.soal_id}_${idx}`}
              type="checkbox"
              name={`soal_${s.soal_id}`}
              value={opt}
              checked={jawaban[s.soal_id]?.includes(opt)}
              onChange={(e) => {
                const prev = jawaban[s.soal_id] || [];
                const newVal = e.target.checked
                  ? [...prev, opt]
                  : prev.filter((v) => v !== opt);
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
        ));

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
        const pairs = JSON.parse(s.pilihan_jawaban);
        const rightOptions = pairs.map((item, idx) => ({
          label: String.fromCharCode(65 + idx),
          text: item.right,
        }));

        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              {pairs.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center space-x-3 p-4 bg-gray-750 rounded-lg border border-gray-600"
                >
                  <span className="w-1/2 text-white font-medium text-sm">
                    <span dangerouslySetInnerHTML={{ __html: item.left }} />
                  </span>
                  <select
                    className="flex-1 w-1 p-2 rounded bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 transition-colors"
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
              ))}
            </div>

            <div className="bg-gray-750 p-4 rounded-lg border border-gray-600">
              {rightOptions.map((opt) => (
                <div key={opt.label} className="mb-3 p-2 bg-gray-700 rounded">
                  <span className="font-bold text-blue-400 text-sm">
                    {opt.label}.
                  </span>
                  <span
                    className="text-white ml-2 text-sm"
                    dangerouslySetInnerHTML={{ __html: opt.text }}
                  />
                </div>
              ))}
            </div>
          </div>
        );

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
      </div>

      <div className="space-y-4">{renderSoal(soal)}</div>
    </div>
  );
};

export default SoalRenderer;
