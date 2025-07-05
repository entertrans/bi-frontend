import React, { useState } from "react";
import { useEffect } from "react";
import { fetchAllSatelit } from "../../../api/siswaAPI";
import Swal from "sweetalert2";

const TambahSiswaAwal = () => {
  const API_URL = process.env.REACT_APP_API_URL;

  const [satelitList, setSatelitList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nama: "",
    nis: "",
    nisn: "",
    satelit: "",
    jenkel: "",
    photo: null,
  });

  const handleChange = (e) => {
    const { id, value, files } = e.target;
    if (id === "photo") {
      setFormData({ ...formData, photo: files[0] });
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("nis", formData.nis);
    form.append("nisn", formData.nisn);
    form.append("nama", formData.nama);
    form.append("jenkel", formData.jenkel);
    form.append("satelit", formData.satelit);
    form.append("photo", formData.photo);

    try {
      Swal.fire({
        title: "Menyimpan data...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const res = await fetch(`${API_URL}/ppdb`, {
        method: "POST",
        body: form,
      });

      Swal.close();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Siswa berhasil ditambahkan!",
          timer: 1500,
          showConfirmButton: false,
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
        }).then(() => {
          window.location.reload();
        });
      } else {
        Swal.fire("Gagal", "Gagal menambahkan siswa.", "error");
      }
    } catch (err) {
      Swal.close();
      Swal.fire("Error", "Terjadi kesalahan: " + err.message, "error");
    }
  };

  useEffect(() => {
    fetchAllSatelit()
      .then((data) => {
        // console.log("DATA SATELIT", data); // Ini harus array
        setSatelitList(data); // Data langsung, bukan data.data
      })
      .catch((err) => {
        console.error("Gagal mengambil data satelit", err);
        setSatelitList([]); // fallback kalau error
      });
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        Tambah Siswa Baru
      </h2>

      <form onSubmit={handleSubmit} className="grid gap-4 text-sm">
        <div>
          <label
            htmlFor="nama"
            className="block mb-1 text-gray-700 dark:text-white"
          >
            Nama Lengkap
          </label>
          <input
            type="text"
            id="nama"
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div>
          <label
            htmlFor="nis"
            className="block mb-1 text-gray-700 dark:text-white"
          >
            NIS
          </label>
          <input
            type="text"
            id="nis"
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div>
          <label
            htmlFor="nisn"
            className="block mb-1 text-gray-700 dark:text-white"
          >
            NISN
          </label>
          <input
            type="text"
            id="nisn"
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div>
          <label
            htmlFor="satelit"
            className="block mb-1 text-gray-700 dark:text-white"
          >
            Satelit / Cabang
          </label>
          <select
            id="satelit"
            onChange={handleChange}
            className="form-input"
            required
          >
            <option value="">-- Pilih Cabang --</option>
            {satelitList.map((s) => (
              <option key={s.satelit_id} value={s.satelit_id}>
                {s.satelit_nama}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="jenkel"
            className="block mb-1 text-gray-700 dark:text-white"
          >
            Jenis Kelamin
          </label>
          <select
            id="jenkel"
            onChange={handleChange}
            className="form-input"
            required
          >
            <option value="">-- Pilih --</option>
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="photo"
            className="block mb-1 text-gray-700 dark:text-white"
          >
            Upload Foto
          </label>
          <input
            type="file"
            id="photo"
            accept="image/*"
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mt-4 ${
            loading && "opacity-50 cursor-not-allowed"
          }`}
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </form>
    </div>
  );
};

export default TambahSiswaAwal;
