import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './Sidebar/Sidebar';
import Login from './Page_Login/login';
import Install from './Page_Install/main-install';
import SNPPmain from './Page_SNPPmain/SNPPmain';
function App() {
  return (
    <Router>
      <div style={{ display: 'flex' }}>
        {/* Sidebar จะอยู่ด้านซ้ายของทุกหน้า */}
        <Sidebar />

        {/* ส่วนของเนื้อหาแต่ละหน้า */}
        <div style={{ flex: 1, padding: '20px' }}>
          <Routes>
            <Route path="/" element={<SNPPmain />} />
            <Route path="/install" element={<Install />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
