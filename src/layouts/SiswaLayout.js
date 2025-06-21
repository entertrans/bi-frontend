import { Outlet } from "react-router-dom";

function SiswaLayout() {
  return (
    <div className="min-h-screen bg-white p-4">
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-indigo-600">Halo, Siswa 👋</h1>
      </header>
      <Outlet />
    </div>
  );
}

export default SiswaLayout;
