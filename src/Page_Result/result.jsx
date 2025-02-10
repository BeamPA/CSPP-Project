
import axios from "axios"; // ใช้ axios ดึงข้อมูลจาก backend
import { Link } from "react-router-dom";
import logo from "../assets/logo-gistda.png";
import Swal from "sweetalert2";

function Sidebar() {
  const handleLogout = (event) => {
    event.preventDefault();
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your session.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "OK",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "/";
      }
    });
  };

  return (
    <div className="w-64 bg-[#0E3B61] p-4 flex flex-col rounded-box h-screen ml-[-12px]">
      <img src={logo} alt="Logo GISTDA" className="w-32 mx-auto mb-4" />
      <div className="tabs flex flex-col items-start mt-20">
        <hr className="w-full border-white mb-1" />
        <Link to="/snpp" className="tab tab-lifted text-white text-[24px]">SNPP-VIIRS</Link>
        <hr className="w-full border-white mt-4" />
      </div>
      <div className="flex-grow"></div>
      <div className="tabs flex flex-col items-start">
        <Link to="/result" className="tab tab-lifted text-white text-[24px]">Result history</Link>
        <hr className="w-full border-white mt-4" />
        <Link to="/install" className="tab tab-lifted text-white text-[24px]">Install</Link>
        <hr className="w-full border-white mt-4" />
        <Link to="/" className="tab tab-lifted text-white text-[24px]" onClick={handleLogout}>Log out</Link>
      </div>
    </div>
  );
}

function ResultHistory() {
  const [isLoading, setIsLoading] = useState(true);
  const [resultData, setResultData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3000/results") // ดึงข้อมูลจาก API
      .then((response) => {
        setResultData(response.data);
        setFilteredData(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      });
  }, []);

  const handleSearch = () => {
    const filtered = resultData.filter((item) => {
      const itemDate = new Date(item.date);
      const itemDateString = itemDate.toISOString().split('T')[0]; // แปลงเป็น "yyyy-mm-dd"

      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      // ตั้งเวลาเป็น 00:00:00 เพื่อให้เปรียบเทียบเฉพาะวันที่
      if (start) start.setHours(0, 0, 0, 0);
      if (end) end.setHours(0, 0, 0, 0);

      const startString = start ? start.toISOString().split('T')[0] : null;
      const endString = end ? end.toISOString().split('T')[0] : null;

      return (
        (!start || itemDateString >= startString) && 
        (!end || itemDateString <= endString)
      );
    });
    setFilteredData(filtered);
  };

  // ฟังก์ชันที่ใช้จัดรูปแบบวันที่
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0'); // วัน
    const month = String(d.getMonth() + 1).padStart(2, '0'); // เดือน (เพิ่ม 1)
    const year = d.getFullYear(); // ปี
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-8 bg-gray-50">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Result History</h1>
        </header>
        <div className="flex items-center gap-4 mb-8">
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="p-2 border rounded-lg w-40 shadow-md focus:ring-2 focus:ring-blue-400" />
          <span className="text-lg">~</span>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="p-2 border rounded-lg w-40 shadow-md focus:ring-2 focus:ring-blue-400" />
          <button onClick={handleSearch} className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transform hover:scale-105 transition">Search</button>
        </div>
        <div className="overflow-x-auto">
          <table className="table-auto w-full bg-white rounded-lg shadow-lg border border-gray-200">
            <thead className="bg-blue-600 text-white rounded-t-lg">
              <tr>
                <th className="p-4 border rounded-tl-lg">Date</th>
                <th className="p-4 border">Image</th>
                <th className="p-4 border">Filename</th>
                <th className="p-4 border">Process</th>
                <th className="p-4 border rounded-tr-lg">Saved Data</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="5" className="text-center p-4">Loading...</td></tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr key={index} className="text-center hover:bg-gray-100 border-b border-gray-200">
                    <td className="p-4 border rounded-l-lg">{formatDate(item.date)}</td>
                    <td className="p-4 border">
                      <img src={`http://localhost:3000/uploads/${item.image}`} alt="Result" className="w-20 mx-auto rounded-md shadow" />
                    </td>
                    <td className="p-4 border">{item.filename}</td>
                    <td className="p-4 border">{item.status}</td>
                    <td className="p-4 border rounded-r-lg">{item.save}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className="text-center p-4">No data available</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ResultHistory;
