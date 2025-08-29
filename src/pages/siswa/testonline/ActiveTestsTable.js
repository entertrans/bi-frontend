import React from "react";
import { HiPlay, HiRefresh, HiClock } from "react-icons/hi";
import Countdown from "react-countdown";

const ActiveTestsTable = ({
  tests,
  activeSessions,
  onKerjakan,
  onLanjutkan,
}) => {
  // cek apakah ada ujian in progress
  const currentActiveTest = Object.values(activeSessions).find(
    (s) => s && s.Status === "in_progress"
  );

  if (tests.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          Tidak ada ujian aktif
        </p>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left">Judul Ujian</th>
              <th className="px-6 py-3 text-left">Mata Pelajaran</th>
              <th className="px-6 py-3 text-left">Jumlah Soal</th>
              <th className="px-6 py-3 text-left">Durasi</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Sisa Waktu</th>
              <th className="px-6 py-3 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {tests.map((test) => {
              const session = activeSessions[test.test_id];
              const hasActiveSession = !!session;
              const isOtherActive =
                currentActiveTest &&
                currentActiveTest.TestID !== test.test_id &&
                currentActiveTest.Status === "in_progress";

              return (
                <tr
                  key={test.test_id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 font-medium">
                    <div>
                      <div className="font-semibold">{test.judul}</div>
                      {test.deskripsi && (
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {test.deskripsi}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">{test?.mapel?.nm_mapel || "-"}</td>
                  <td className="px-6 py-4">
                    {test.jumlah_soal_tampil || 0} soal
                  </td>
                  <td className="px-6 py-4">{test.durasi_menit} menit</td>
                  <td className="px-6 py-4">
                    {hasActiveSession ? (
                      session.Status === "in_progress" ? (
                        <span className="text-green-600 font-semibold">
                          Dalam Proses
                        </span>
                      ) : (
                        <span className="text-gray-600 font-semibold">
                          Test Selesai
                        </span>
                      )
                    ) : (
                      <span className="text-blue-600">Belum Dimulai</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {hasActiveSession && session.Status === "in_progress" && (
                      <div className="flex items-center gap-2">
                        <HiClock className="text-yellow-500" />
                        <Countdown
                          date={new Date(session.EndTime)}
                          renderer={({
                            hours,
                            minutes,
                            seconds,
                            completed,
                          }) => {
                            if (completed)
                              return (
                                <span className="text-red-500">Selesai</span>
                              );
                            return (
                              <span className="text-green-400">
                                {hours > 0 ? `${hours}:` : ""}
                                {minutes.toString().padStart(2, "0")}:
                                {seconds.toString().padStart(2, "0")}
                              </span>
                            );
                          }}
                        />
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    {hasActiveSession ? (
                      session.Status === "in_progress" ? (
                        <button
                          onClick={() => onLanjutkan(test.test_id)}
                          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                        >
                          <HiRefresh className="text-lg" />
                          Lanjutkan
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            console.log("Lihat nilai", session.SessionID)
                          }
                          className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg"
                        >
                          📊 Lihat Nilai
                        </button>
                      )
                    ) : (
                      <button
                        onClick={() => {
                          if (isOtherActive) {
                            alert(
                              `Sedang mengerjakan ${currentActiveTest.NamaMapel}, selesaikan dulu sebelum memulai ujian lain.`
                            );
                            return;
                          }
                          onKerjakan(
                            test.test_id,
                            test.judul,
                            test.durasi_menit
                          );
                        }}
                        disabled={isOtherActive}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                          isOtherActive
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-500 hover:bg-green-600 text-white"
                        }`}
                      >
                        <HiPlay className="text-lg" />
                        Kerjakan
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActiveTestsTable;
