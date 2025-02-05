import { Route, Routes, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";
import Login from "./Page_Login/login";
import Install from "./Page_Install/main-install";
import SNPP from "./Page_SNPPmain/SNPP";
import ForgotPassword from "./Page_Login/forgot";

function App() {
  const location = useLocation();
  const showSidebar = location.pathname !== "/"; // ถ้าอยู่หน้า Login ไม่แสดง Sidebar
  const handleLogin = (email) => {
    console.log("User logged in with email:", email);
  };
  return (
    <div style={{ display: "flex" }}>
      {showSidebar && <Sidebar />}{" "}
      {/* แสดง Sidebar เฉพาะเมื่อไม่ใช่หน้า Login */}
      <div style={{ flex: 1, padding: "20px" }}>
        <Routes>
          <Route path="/" element={<Login onLogin={handleLogin} />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/SNPP" element={<SNPP />} />
          <Route path="/install" element={<Install />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
