import React from "react";
import { HiPlay, HiEye } from "react-icons/hi";
import dayjs from "dayjs";

const ActiveTugasTable = ({ tasks, submissions, onKerjakan, onView }) => {
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

              return (
                <tr
                  key={task.test_id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 font-medium">{task.judul}</td>
                  <td className="px-6 py-4">{task.mapel?.nm_mapel}</td>
                  <td className="px-6 py-4">{task.guru?.guru_nama}</td>
                  <td className="px-6 py-4">
                    {deadline.format("DD MMM YYYY HH:mm")}
                  </td>
                  <td className="px-6 py-4">
                    {isSubmitted ? (
                      <span className="text-green-600 font-semibold">
                        ✅ Sudah Dikumpulkan
                      </span>
                    ) : isLate ? (
                      <span className="text-red-600 font-semibold">
                        ⛔ Terlambat
                      </span>
                    ) : (
                      <span className="text-yellow-600 font-semibold">
                        🕒 Belum Dikumpulkan
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {isSubmitted ? (
                      <button
                        onClick={() => onView(task.test_id)}
                        className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                      >
                        <HiEye /> Lihat
                      </button>
                    ) : !isLate ? (
                      <button
                        onClick={() => onKerjakan(task.test_id, task.judul)}
                        className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                      >
                        <HiPlay /> Kerjakan
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

export default ActiveTugasTable;
