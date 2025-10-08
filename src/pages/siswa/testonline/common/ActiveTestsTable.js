import React from "react";
import {
  HiPlay,
  HiRefresh,
  HiClock,
  HiBookOpen,
  HiUser,
  HiExclamationCircle,
} from "react-icons/hi";
import Countdown from "react-countdown";
import Swal from "sweetalert2";
import { fetchNilaiBySession } from "../../../../api/testOnlineAPI";
import { cardStyles } from "../../../../utils/CardStyles";
import { getRowColor } from "../../../../utils/TableStyles";

const ActiveTestsTable = ({
  tests,
  activeSessions,
  onKerjakan,
  onLanjutkan,
}) => {
  // Cek apakah ada test yang sedang dikerjakan
  const currentActiveSession = Object.values(activeSessions).find(
    (session) => session && session.Status === "in_progress"
  );

  const handleLihatNilai = async (sessionID, testJudul) => {
    try {
      Swal.fire({
        title: "Memuat nilai...",
        text: "Sedang mengambil data nilai",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await fetchNilaiBySession(sessionID);
      Swal.close();

      Swal.fire({
        title: `Nilai Ujian`,
        html: `
          <div class="text-center">
            <h3 class="text-xl font-bold mb-2">${testJudul}</h3>
            <div class="text-4xl font-bold text-blue-600 mb-4">${response.nilai_akhir.toFixed(
              2
            )}</div>
          </div>
        `,
        icon: "success",
        confirmButtonText: "Tutup",
        buttonsStyling: false,
        customClass: {
          actions: "flex justify-center",
          confirmButton:
            "bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 mr-2 rounded",
        },
      });
    } catch (error) {
      console.error("Error fetching nilai:", error);
      Swal.fire({
        title: "Error",
        text: "Gagal mengambil data nilai",
        icon: "error",
      });
    }
  };

  const handleKerjakanClick = (test, session) => {
    // Jika ada test lain yang sedang dikerjakan
    if (
      currentActiveSession &&
      currentActiveSession.SessionID !== session?.SessionID
    ) {
      Swal.fire({
        title: "Ujian Sedang Berlangsung",
        html: `
          <div class="text-center">
            <div class="text-4xl mb-3">⏳</div>
            <p class="text-lg font-semibold mb-2">Anda sedang mengerjakan ujian lain</p>
            <p class="text-gray-600">Selesaikan ujian yang sedang berjalan terlebih dahulu sebelum memulai ujian baru.</p>
          </div>
        `,
        icon: "warning",
        confirmButtonText: "Mengerti",
        buttonsStyling: false,
        customClass: {
          confirmButton:
            "bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg",
        },
      });
      return;
    }

    if (session) {
      onLanjutkan(session);
    } else {
      onKerjakan(test.test_id, test.judul, test.durasi_menit);
    }
  };

  // Fungsi untuk menentukan apakah test bisa dikerjakan
  const canTakeTest = (test) => {
    // Logika: Test bisa dikerjakan jika:
    // 1. Tidak ada session yang sedang berjalan untuk test lain
    // 2. Test memiliki jumlah_soal_tampil > 0
    // 3. (Opsional) Cek deadline jika ada
    const hasQuestions = test.jumlah_soal_tampil > 0;
    const isNotActiveForOtherTest =
      !currentActiveSession ||
      activeSessions[test.test_id]?.SessionID ===
        currentActiveSession.SessionID;

    // Cek deadline jika ada
    const now = new Date();
    const deadline = test.deadline ? new Date(test.deadline) : null;
    const isWithinDeadline = !deadline || deadline > now;

    return hasQuestions && isNotActiveForOtherTest && isWithinDeadline;
  };

  if (tests.length === 0) {
    return (
      <div
        className={`${cardStyles.base} ${cardStyles.blue.container} border-l-4 p-6 text-center`}
      >
        <div className="text-3xl mb-2">📚</div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">
          Tidak ada ujian aktif
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Semua ujian telah selesai atau belum ada jadwal ujian
        </p>
      </div>
    );
  }

  return (
    <div
      className={`${cardStyles.base} ${cardStyles.blue.container} border-l-4`}
    >
      {/* Info jumlah data */}
      <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
        <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
          📊 Menampilkan {tests.length} ujian aktif
          {currentActiveSession && " • Ada ujian yang sedang dikerjakan"}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        {/* Table Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700">
          <div className="grid grid-cols-12 gap-4 px-6 py-4">
            <div className="col-span-5 text-left text-xs font-semibold text-white uppercase tracking-wider">
              UJIAN
            </div>
            <div className="col-span-2 text-left text-xs font-semibold text-white uppercase tracking-wider">
              MAPEL
            </div>
            <div className="col-span-1 text-center text-xs font-semibold text-white uppercase tracking-wider">
              SOAL
            </div>
            <div className="col-span-1 text-center text-xs font-semibold text-white uppercase tracking-wider">
              DURASI
            </div>
            <div className="col-span-3 text-center text-xs font-semibold text-white uppercase tracking-wider">
              STATUS & AKSI
            </div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {tests.map((test, index) => {
            const session = activeSessions[test.test_id];
            const endTime = session?.EndTime ? new Date(session.EndTime) : null;
            const isCompleted =
              session &&
              (session.Status === "submitted" || session.Status === "graded");
            const isActive = session && session.Status === "in_progress";
            const isOtherActive =
              currentActiveSession &&
              currentActiveSession.SessionID !== session?.SessionID;
            const canTake = canTakeTest(test);

            const getStatusColor = () => {
              if (!session) return "blue";
              if (isCompleted) return "purple";
              return "orange";
            };

            const statusColor = getStatusColor();
            const style = cardStyles[statusColor];

            return (
              <div
                key={test.test_id}
                className={`transition-all duration-200 ${getRowColor(index)}`}
              >
                <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center">
                  {/* Judul dan Deskripsi */}
                  <div className="col-span-5">
                    <div className="flex items-start space-x-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm leading-tight mb-1">
                          {test.judul}
                        </h3>
                        {test.deskripsi && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                            {test.deskripsi}
                          </p>
                        )}
                        {/* Info deadline */}
                        {test.deadline && (
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <HiClock className="w-3 h-3 mr-1" />
                            Deadline:{" "}
                            {new Date(test.deadline).toLocaleDateString(
                              "id-ID"
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Mapel */}
                  <div className="col-span-2">
                    <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                      <HiBookOpen className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" />
                      <span className="truncate">{test.mapel?.nm_mapel}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <HiUser className="w-3 h-3 mr-1 text-green-500 flex-shrink-0" />
                      <span className="truncate">{test.guru?.guru_nama}</span>
                    </div>
                  </div>

                  {/* Jumlah Soal */}
                  <div className="col-span-1 text-center">
                    <span
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                        test.jumlah_soal_tampil > 0
                          ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {test.jumlah_soal_tampil}
                    </span>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      soal
                    </div>
                  </div>

                  {/* Durasi */}
                  <div className="col-span-1 text-center">
                    <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      {test.durasi_menit}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      menit
                    </div>
                  </div>

                  {/* Status & Aksi */}
                  <div className="col-span-3">
                    {/* Status Badge */}
                    <div className="flex items-center justify-center mb-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${style.badge}`}
                      >
                        {!session
                          ? "⏳ Belum Dimulai"
                          : isCompleted
                          ? "✅ Selesai"
                          : "🟠 Dalam Proses"}
                      </span>
                    </div>

                    {/* Countdown Timer */}
                    {isActive && (
                      <div className="flex items-center justify-center text-xs text-orange-600 dark:text-orange-400 mb-2">
                        <HiClock className="w-3 h-3 mr-1" />
                        <Countdown
                          date={endTime}
                          renderer={({
                            hours,
                            minutes,
                            seconds,
                            completed,
                          }) => {
                            if (completed)
                              return (
                                <span className="text-red-500 font-semibold">
                                  Waktu Habis!
                                </span>
                              );
                            return (
                              <span className="font-mono font-semibold">
                                {hours > 0 ? `${hours}:` : ""}
                                {minutes.toString().padStart(2, "0")}:
                                {seconds.toString().padStart(2, "0")}
                              </span>
                            );
                          }}
                        />
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-center space-x-2">
                      {session ? (
                        isCompleted ? (
                          <button
                            onClick={() =>
                              handleLihatNilai(session.SessionID, test.judul)
                            }
                            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md"
                          >
                            <HiBookOpen className="w-4 h-4" />
                            Lihat Nilai
                          </button>
                        ) : (
                          <button
                            onClick={() => onLanjutkan(test.test_id)}
                            className={`flex items-center gap-2 ${style.button} px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md`}
                          >
                            <HiRefresh className="w-4 h-4" />
                            Lanjutkan
                          </button>
                        )
                      ) : (
                        <button
                          onClick={() => handleKerjakanClick(test, null)}
                          disabled={!canTake}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md ${
                            canTake
                              ? "bg-green-600 hover:bg-green-700 text-white"
                              : "bg-gray-400 text-gray-200 cursor-not-allowed"
                          }`}
                        >
                          <HiPlay className="w-4 h-4" />
                          {canTake ? "Kerjakan" : "Tidak Tersedia"}
                        </button>
                      )}
                    </div>

                    {/* Warning messages */}
                    {!canTake && !session && (
                      <div className="mt-2 text-xs text-orange-600 dark:text-orange-400 text-center">
                        {test.jumlah_soal_tampil === 0 && (
                          <div className="flex items-center justify-center">
                            <HiExclamationCircle className="w-3 h-3 mr-1" />
                            Tidak ada soal
                          </div>
                        )}
                        {isOtherActive && test.jumlah_soal_tampil > 0 && (
                          <div className="flex items-center justify-center">
                            <HiExclamationCircle className="w-3 h-3 mr-1" />
                            Selesaikan ujian yang sedang berjalan
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Footer */}
        {tests.length > 0 && (
          <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              📚 Total {tests.length} ujian aktif •
              {currentActiveSession
                ? " 📝 Ada ujian yang sedang dikerjakan"
                : " ✅ Semua ujian siap dikerjakan"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveTestsTable;
