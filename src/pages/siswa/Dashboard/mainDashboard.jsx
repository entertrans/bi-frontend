import React, { useEffect, useState } from "react";
import { getInvoiceTerakhir, getNotStartedTests } from "../../../api/siswaAPI";
import { useAuth } from "../../../contexts/AuthContext";
import InfoTestDashboard from "./InfoTestDashboard";
import InfoKeuanganDashboard from "./InfoKeuanganDashboard";

const Dashboard = () => {
  const [invoice, setInvoice] = useState(null);
  const [notStartedTests, setNotStartedTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const nis = user?.siswa?.siswa_nis;

  // ===== Fetch Data =====
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [invoiceData, testsData] = await Promise.all([
          getInvoiceTerakhir(nis),
          getNotStartedTests(nis)
        ]);

        // Handle invoice data
        if (invoiceData && typeof invoiceData === "object" && invoiceData.message) {
          setInvoice(null);
        } else {
          setInvoice(invoiceData);
        }

        // Handle tests data
        setNotStartedTests(testsData?.data || []);
      } catch (err) {
        console.error("Gagal ambil data:", err);
        setInvoice(null);
        setNotStartedTests([]);
      } finally {
        setLoading(false);
      }
    };

    if (nis) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [nis]);

  // ===== Loading State =====
  if (loading) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
        <p className="text-gray-500 dark:text-gray-400 text-center">
          Memuat data dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Welcome */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 rounded-2xl p-6 text-white shadow-sm">
        <h1 className="text-2xl font-bold mb-2">
          Selamat datang, {user?.siswa?.siswa_nama}!
        </h1>
        <p className="opacity-90 text-sm">
          {notStartedTests.length > 0 
            ? `Ada ${notStartedTests.length} test/tugas menunggu untuk dikerjakan` 
            : "Tidak ada test/tugas baru"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kolom Kiri: Test/Tugas Baru */}
        <InfoTestDashboard 
          tests={notStartedTests}
          onTestsUpdate={setNotStartedTests}
        />

        {/* Kolom Kanan: Tagihan */}
        <InfoKeuanganDashboard invoice={invoice} />
      </div>
    </div>
  );
};

export default Dashboard;