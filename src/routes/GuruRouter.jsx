import Home from "../pages/guru/Home";
import Course from "../pages/guru/Course";
import Nilai from "../pages/guru/Nilai";
import KisiKisi from "../pages/guru/KisiKisi";
import TestOnline from "../pages/guru/TestOnline";
import Ulangan from "../pages/guru/Ulangan";
import Logout from "../pages/guru/Logout";

export const guruRoutes = [
  { path: "/guru", element: <Home /> },
  { path: "/guru/course", element: <Course /> },
  { path: "/guru/nilai", element: <Nilai /> },
  { path: "/guru/kisi-kisi", element: <KisiKisi /> },
  { path: "/guru/test-online", element: <TestOnline /> },
  { path: "/guru/ulangan", element: <Ulangan /> },
  { path: "/guru/logout", element: <Logout /> },
];

export default guruRoutes;
