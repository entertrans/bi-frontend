import React from "react";
import {
  HiPlay,
  HiPencilAlt,
  HiEye,
  HiBookOpen,
  HiUser,
  HiExclamationCircle,
} from "react-icons/hi";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import { fetchNilaiBySession } from "../../../../api/testOnlineAPI";
import { cardStyles } from "../../../../utils/CardStyles";
import { getRowColor } from "../../../../utils/TableStyles";

const ActiveTugasTable = ({ tasks, submissions, onKerjakan, onView }) => {
  // Cek apakah ada yang sudah

  const handleLihatNilai = async (sessionID, judulTugas) => {
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
        title: `Nilai Tugas`,
        html: `
          <div class="text-center">
            <h3 class="text-xl font-bold mb-2">${judulTugas}</h3>
            <div class="text-4xl font-bold ${
              response.nilai_akhir >= 80
                ? "text-green-600"
                : response.nilai_akhir >= 60
                ? "text-yellow-600"
                : "text-red-600"
            } mb-4">${response.nilai_akhir?.toFixed(2) || "0.00"}</div>
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
      console.error("Error fetching nilai tugas:", error);
      Swal.fire({
        title: "Error",
        text: "Gagal mengambil data nilai",
        icon: "error",
      });
    }
  };

  const handleKerjakanClick = (task, submission) => {
    // Cegah buka tugas baru kalau sedang ada in_progress lain

    // Logika berdasarkan status
    if (submission) {
      switch (submission.Status) {
        case "in_progress":
          onView(task.test_id); // lanjutkan kerja
          break;
        case "onqueue":
          onKerjakan(task.test_id, task.judul); // revisi tugas
          break;
        case "submitted":
          Swal.fire({
            title: "Tugas Sudah Dikumpulkan",
            text: "Tugas ini sudah dikumpulkan dan tidak dapat diubah lagi.",
            icon: "info",
          });
          break;
        default:
          onKerjakan(task.test_id, task.judul); // tugas baru
      }
    } else {
      onKerjakan(task.test_id, task.judul); // belum ada submission
    }
  };

  // Fungsi untuk mendapatkan style berdasarkan status
  const getStatusStyle = (task, submission) => {
    const deadline = dayjs(task.deadline);
    const now = dayjs();

    const isLate = now.isAfter(deadline);
    const isSubmitted = submission?.Status === "submitted";
    const isGraded = submission?.Status === "graded";
    const isInProgress = submission?.Status === "in_progress";
    const isOnQueue = submission?.Status === "onqueue";

    if (isGraded) return cardStyles.purple;
    if (isSubmitted) return cardStyles.blue;
    if (isInProgress || isOnQueue) return cardStyles.orange;
    if (isLate) return cardStyles.red;
    return cardStyles.blue; // default untuk belum dikerjakan sama sekali
  };

  // Fungsi untuk mendapatkan teks status
  const getStatusText = (task, submission) => {
    const deadline = dayjs(task.deadline);
    const now = dayjs();

    const isLate = now.isAfter(deadline);
    const isSubmitted = submission?.Status === "submitted";
    const isGraded = submission?.Status === "graded";
    const isInProgress = submission?.Status === "in_progress";
    const isOnQueue = submission?.Status === "onqueue";

    if (isGraded) return "✅ Sudah Dinilai";
    if (isSubmitted) return "📤 Sudah Dikumpulkan";
    if (isInProgress) return "📝 Sedang Dikerjakan";
    if (isOnQueue) return "✏️ Sudah Dikumpulkan";
    if (isLate) return "⛔ Terlambat";
    return "🕒 Belum Ditutup";
  };

  // Fungsi untuk mendapatkan teks button
  const getButtonText = (task, submission) => {
    const deadline = dayjs(task.deadline);
    const now = dayjs();
    const isLate = now.isAfter(deadline);

    if (isLate) return "Tidak tersedia";

    const status = submission?.Status;
    if (status === "graded") return "Lihat Nilai";
    if (status === "submitted") return "Sudah Dikumpulkan";
    if (status === "in_progress") return "Lanjutkan";
    if (status === "onqueue") return "Revisi";
    return "Kerjakan";
  };

  if (tasks.length === 0) {
    return (
      <div
        className={`${cardStyles.base} ${cardStyles.blue.container} border-l-4 p-6 text-center`}
      >
        <div className="text-3xl mb-2">📋</div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">
          Tidak ada tugas aktif
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Semua tugas telah selesai atau belum ada penugasan baru
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
          📊 Menampilkan {tasks.length} tugas aktif
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        {/* Table Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700">
          <div className="grid grid-cols-12 gap-4 px-6 py-4">
            <div className="col-span-5 text-left text-xs font-semibold text-white uppercase tracking-wider">
              TUGAS
            </div>
            <div className="col-span-2 text-left text-xs font-semibold text-white uppercase tracking-wider">
              MAPEL
            </div>
            <div className="col-span-2 text-center text-xs font-semibold text-white uppercase tracking-wider">
              DEADLINE
            </div>
            <div className="col-span-3 text-center text-xs font-semibold text-white uppercase tracking-wider">
              STATUS & AKSI
            </div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {tasks.map((task, index) => {
            const submission = submissions[task.test_id];
            const deadline = dayjs(task.deadline);
            const now = dayjs();

            const isLate = now.isAfter(deadline);
            const isSubmitted = submission?.Status === "submitted";
            const isGraded = submission?.Status === "graded";
            const isInProgress = submission?.Status === "in_progress";
            const isOnQueue = submission?.Status === "onqueue";
            // const isOtherActive =
            //   currentActiveSubmission &&
            //   currentActiveSubmission.SessionID !== submission?.SessionID;

            const style = getStatusStyle(task, submission);
            const statusText = getStatusText(task, submission);
            const buttonText = getButtonText(task, submission);

            return (
              <div
                key={task.test_id}
                className={`transition-all duration-200 ${getRowColor(index)}`}
              >
                <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center">
                  {/* Judul dan Deskripsi */}
                  <div className="col-span-5">
                    <div className="flex items-start space-x-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm leading-tight mb-1">
                          {task.judul}
                        </h3>
                        {task.deskripsi && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                            {task.deskripsi}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Mapel dan Guru */}
                  <div className="col-span-2">
                    <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                      <HiBookOpen className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" />
                      <span className="truncate">{task.mapel?.nm_mapel}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <HiUser className="w-3 h-3 mr-1 text-green-500 flex-shrink-0" />
                      <span className="truncate">{task.guru?.guru_nama}</span>
                    </div>
                  </div>

                  {/* Deadline */}
                  <div className="col-span-2 text-center">
                    <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      {deadline.format("DD MMM YYYY")}
                    </div>
                    <div
                      className={`text-xs ${
                        isLate
                          ? "text-red-600 font-medium"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {deadline.format("HH:mm")}
                      {isLate && " ⚠️ Terlambat"}
                    </div>
                  </div>

                  {/* Status & Aksi */}
                  <div className="col-span-3">
                    {/* Status Badge */}
                    <div className="flex items-center justify-center mb-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${style.badge}`}
                      >
                        {statusText}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center space-x-2">
                      {isGraded ? (
                        <button
                          onClick={() =>
                            handleLihatNilai(submission.SessionID, task.judul)
                          }
                          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md"
                        >
                          <HiEye className="w-4 h-4" />
                          {buttonText}
                        </button>
                      ) : isSubmitted ? (
                        <button
                          onClick={() => onView(task.test_id)}
                          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md"
                        >
                          <HiPencilAlt className="w-4 h-4" />
                          {buttonText}
                        </button>
                      ) : isInProgress || isOnQueue ? (
                        <button
                          onClick={() => handleKerjakanClick(task, submission)}
                          className={`flex items-center gap-2 ${style.button} px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md`}
                        >
                          <HiPlay className="w-4 h-4" />
                          {buttonText}
                        </button>
                      ) : !isLate ? (
                        <button
                          onClick={() => handleKerjakanClick(task, null)}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md bg-green-600 hover:bg-green-700 text-white"
                        >
                          <HiPlay className="w-4 h-4" />
                          {buttonText}
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 px-4 py-2 bg-gray-400 text-gray-200 rounded-lg text-sm font-medium cursor-not-allowed shadow-sm">
                          <HiExclamationCircle className="w-4 h-4" />
                          {buttonText}
                        </div>
                      )}
                    </div>

                    {/* Warning jika ada tugas lain yang aktif */}
                    {/* {isOtherActive && !submission && (
                      <div className="mt-2 text-xs text-orange-600 dark:text-orange-400 text-center flex items-center justify-center">
                        <HiExclamationCircle className="w-3 h-3 mr-1" />
                        Selesaikan tugas yang sedang dikerjakan
                      </div>
                    )} */}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Footer */}
        {tasks.length > 0 && (
          <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              📋 Total {tasks.length} tugas aktif • ✅ Semua tugas siap
              dikerjakan
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveTugasTable;
