import { Route, Routes, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";
import Login from "./Page_Login/login";
import ForgotPassword from "./Page_Login/forgot";
import SNPP from "./Page_SNPPmain/SNPP";
import Install from "./Page_Install/main-install";
import SDR from "./Page_Install/sdr";
import EDR from "./Page_Install/edr";
import ISR from "./Page_Install/isr";
import MR from "./Page_Install/mr";
import US from "./Page_Install/us";
import LS from "./Page_Install/ls";


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
          <Route path="/snpp" element={<SNPP />} />
          <Route path="/install" element={<Install />} />
          <Route path="/SDR" element={<SDR />} />
          <Route path="/EDR" element={<EDR />} />
          <Route path="/ISR" element={<ISR />} />
          <Route path="/MR" element={<MR />} />
          <Route path="/US" element={<US />} />
          <Route path="/LS" element={<LS />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
