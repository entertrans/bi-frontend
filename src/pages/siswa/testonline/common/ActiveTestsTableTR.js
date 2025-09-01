import React from "react";
import { HiPlay, HiRefresh, HiClock } from "react-icons/hi";
import Countdown from "react-countdown";

const ActiveTestsTableTR = ({
  tests,
  activeSessions,
  onKerjakan,
  onLanjutkan,
}) => {
  if (tests.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          Tidak ada Test Review
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
              <th className="px-6 py-3 text-left w-1/3">Judul</th>
              <th className="px-6 py-3 text-left">Mapel</th>
              <th className="px-6 py-3 text-left">Guru</th>
              <th className="px-6 py-3 text-left">Jumlah Soal</th>
              <th className="px-6 py-3 text-left">Durasi</th>
              <th className="px-6 py-3 text-left">Sisa Waktu</th>
              <th className="px-6 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {tests.map((test) => {
              const session = activeSessions[test.test_id];
              const isSubmitted = !!session?.SubmittedAt;
              const endTime = session?.EndTime
                ? new Date(session.EndTime)
                : null;

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
                  <td className="px-6 py-4">{test.mapel?.nm_mapel}</td>
                  <td className="px-6 py-4">{test.guru?.guru_nama}</td>
                  <td className="px-6 py-4">{test.jumlah_soal_tampil}</td>
                  <td className="px-6 py-4">{test.durasi_menit} menit</td>
                  <td className="px-6 py-4">
                    {session && !isSubmitted && endTime ? (
                      <div className="flex items-center gap-2">
                        <HiClock className="text-yellow-500" />
                        <Countdown
                          date={endTime}
                          renderer={({
                            hours,
                            minutes,
                            seconds,
                            completed,
                          }) => {
                            if (completed) {
                              return (
                                <span className="text-red-500 font-semibold">
                                  Habis
                                </span>
                              );
                            }
                            return (
                              <span className="text-green-500 font-semibold">
                                {hours > 0 ? `${hours}:` : ""}
                                {minutes.toString().padStart(2, "0")}:
                                {seconds.toString().padStart(2, "0")}
                              </span>
                            );
                          }}
                        />
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {session ? (
                      isSubmitted ? (
                        <span className="px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded">
                          📊 Lihat Nilai
                        </span>
                      ) : (
                        <button
                          onClick={() => onLanjutkan(session)}
                          className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
                        >
                          <HiRefresh />
                          Lanjutkan
                        </button>
                      )
                    ) : test.aktif === 1 ? (
                      <button
                        onClick={() =>
                          onKerjakan(
                            test.test_id,
                            test.judul,
                            test.durasi_menit
                          )
                        }
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                      >
                        <HiPlay />
                        Kerjakan
                      </button>
                    ) : (
                      <span className="text-gray-400 text-sm">
                        Tidak tersedia
                      </span>
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

export default ActiveTestsTableTR;
