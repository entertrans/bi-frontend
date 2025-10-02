import React from "react";
import { HiPlay, HiPencilAlt, HiEye } from "react-icons/hi";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import { fetchNilaiBySession } from "../../../../api/testOnlineAPI"; // sesuaikan path API

const ActiveTugasTable = ({ tasks, submissions, onKerjakan, onView }) => {
  // Fungsi untuk lihat nilai tugas
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
                ? 'text-green-600' 
                : response.nilai_akhir >= 60 
                ? 'text-yellow-600' 
                : 'text-red-600'
            } mb-4">${response.nilai_akhir?.toFixed(2) || '0.00'}</div>
            <p class="text-gray-600 mb-2">Status: ${response.status || 'Telah dinilai'}</p>
          </div>
        `,
        icon: "info",
        confirmButtonText: "Tutup",
        confirmButtonColor: "#3B82F6",
        buttonsStyling: false,
        customClass: {
          popup: "rounded-lg",
          actions: "flex justify-center",
          confirmButton:
            "bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded",
        },
      });
    } catch (error) {
      console.error("Error fetching nilai tugas:", error);
      Swal.fire({
        title: "Error",
        text: "Gagal mengambil data nilai",
        icon: "error",
        confirmButtonText: "Tutup",
      });
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          Tidak ada tugas aktif
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
              <th className="px-6 py-3 text-left w-1/3">Judul Tugas</th>
              <th className="px-6 py-3 text-left">Mata Pelajaran</th>
              <th className="px-6 py-3 text-left">Guru</th>
              <th className="px-6 py-3 text-left">Deadline</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {tasks.map((task) => {
              const submission = submissions[task.test_id];
              const deadline = dayjs(task.deadline);
              const now = dayjs();

              const isLate = now.isAfter(deadline);
              const isSubmitted = !!submission;
              const isGraded = submission?.status === "graded" || submission?.nilai_akhir !== undefined;
              const isWaitingGrade = isSubmitted && !isGraded;

              return (
                <tr
                  key={task.test_id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 font-medium">
                    <div>
                      <div className="font-semibold">{task.judul}</div>
                      {task.deskripsi && (
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {task.deskripsi}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">{task.mapel?.nm_mapel}</td>
                  <td className="px-6 py-4">{task.guru?.guru_nama}</td>
                  <td className="px-6 py-4">
                    <div>
                      {deadline.format("DD MMM YYYY HH:mm")}
                      {isLate && (
                        <div className="text-xs text-red-500 mt-1">
                          ⚠️ Terlambat
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {isGraded ? (
                      <span className="text-green-600 font-semibold">
                        ✅ Sudah Dinilai
                      </span>
                    ) : isWaitingGrade ? (
                      <span className="text-yellow-600 font-semibold">
                        ⏳ Menunggu Penilaian
                      </span>
                    ) : isSubmitted ? (
                      <span className="text-blue-600 font-semibold">
                        📤 Sudah Dikumpulkan
                      </span>
                    ) : isLate ? (
                      <span className="text-red-600 font-semibold">
                        ⛔ Terlambat
                      </span>
                    ) : (
                      <span className="text-orange-600 font-semibold">
                        🕒 Belum Dikumpulkan
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {isGraded ? (
                        // Sudah dinilai - tampilkan tombol Lihat Nilai
                        <button
                          onClick={() => handleLihatNilai(submission.session_id, task.judul)}
                          className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg"
                        >
                          <HiEye />
                          Lihat Nilai
                        </button>
                      ) : isWaitingGrade ? (
                        // Sudah dikumpulkan tapi belum dinilai
                        <span className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg opacity-75 cursor-not-allowed">
                          <HiEye />
                          Menunggu Nilai
                        </span>
                      ) : isSubmitted ? (
                        // Sudah dikumpulkan tapi belum dinilai - bisa revisi
                        <button
                          onClick={() => onView(task.test_id)}
                          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                        >
                          <HiPencilAlt /> 
                          Revisi
                        </button>
                      ) : !isLate ? (
                        // Belum dikumpulkan dan belum lewat deadline
                        <button
                          onClick={() => onKerjakan(task.test_id, task.judul)}
                          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                        >
                          <HiPlay /> 
                          Kerjakan
                        </button>
                      ) : (
                        // Sudah lewat deadline dan belum dikumpulkan
                        <span className="text-gray-400 text-sm flex items-center">
                          Tidak tersedia
                        </span>
                      )}
                    </div>
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

export default ActiveTugasTable;