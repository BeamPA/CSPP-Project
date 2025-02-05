import { useState } from "react";
import { Link } from "react-router-dom";

const softwareList = [
  { name: "CSPP Sensor Data Record (SDR) Software", path: "/SDR" },
  { name: "CSPP Image Environmental Data Record (EDR) Retrieval Software", path: "/EDR" },
  { name: "CSPP Infrared Sounder Retrieval Software", path: "/ISR" },
  { name: "CSPP Microwave Retrieval Software", path: "/MR" },
  { name: "CSPP Utility Software", path: "/US" },
  { name: "CSPP Legacy Software - No Support Provided", path: "/LS" },
];

function Install() {
  const [searchTerm, setSearchTerm] = useState("");

  // กรองข้อมูลตามคำค้นหา
  const filteredSoftware = softwareList.filter((software) =>
    software.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-h-screen w-full flex justify-center items-start">
      <div className="w-full max-w-6xl p-6">
        {/* ช่องค้นหา */}
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 mb-4 border rounded-md shadow-sm"
        />

        {/* หัวข้อ Install */}
        <h1 className="text-2xl font-bold mb-4">Install</h1>

        {/* เช็คว่ามีข้อมูลหรือไม่ */}
        <div className="max-h-[800px] overflow-y-auto">
          {filteredSoftware.length > 0 ? (
            <div className="space-y-3">
              {filteredSoftware.map((software) => (
                <Link key={software.name} to={software.path}>
                  <button className="w-full p-4 text-left bg-[#EDEDED] rounded-md shadow-md hover:shadow-lg transition duration-200 mb-3">
                    {software.name}
                  </button>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">ไม่พบข้อมูลที่ตรงกับคำค้นหา</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Install;
