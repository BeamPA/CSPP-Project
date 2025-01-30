import { Route, Routes, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";
import Login from "./Page_Login/login";
import Install from "./Page_Install/main-install";
import SNPPmain from "./Page_SNPPmain/SNPPmain";
import ForgotPassword from "./Page_Login/forgot";

function App() {
  const location = useLocation();
  const showSidebar = location.pathname !== "/"; // ถ้าอยู่หน้า Login ไม่แสดง Sidebar

  return (
    <div style={{ display: "flex" }}>
      {showSidebar && <Sidebar />}{" "}
      {/* แสดง Sidebar เฉพาะเมื่อไม่ใช่หน้า Login */}
      <div style={{ flex: 1, padding: "20px" }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/snpp" element={<SNPPmain />} />
          <Route path="/install" element={<Install />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
