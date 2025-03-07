import { Route, Routes, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";
import Login from "./Page_Login/login";
import ForgotPassword from "./Page_Login/forgot";
import SNPP from "./Page_SNPPmain/SNPPV2";
import Install from "./Page_Install/main-install";
import SoftwareTable from "./Page_Install/SoftwareTable";
import ResultHistory from "./Page_Result/result";
import ProtectedRoute from "./Routes/ProtectedRoute";

function App() {
  const location = useLocation();
  const hideSidebarPaths = ["/", "/forgot-password"]; // กำหนดหน้าที่ไม่ต้องการแสดง Sidebar
  const showSidebar = !hideSidebarPaths.includes(location.pathname);

  const handleLogin = (email) => {
    console.log("User logged in with email:", email);
  };

  return (
    <div style={{ display: "flex" }}>
      {showSidebar && <Sidebar />} {/* แสดง Sidebar เมื่อไม่ใช่หน้าที่กำหนด */}
      <div style={{ flex: 1, padding: "20px" }}>
        <Routes>
          <Route path="/" element={<Login onLogin={handleLogin} />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* ใช้ ProtectedRoute สำหรับหน้าที่ต้องการการล็อกอิน */}
          <Route element={<ProtectedRoute />}>
            <Route path="/snpp" element={<SNPP />} />
            <Route path="/install" element={<Install />} />
            <Route path="/CSPP/:category" element={<SoftwareTable />} />
            <Route path="/result" element={<ResultHistory />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
