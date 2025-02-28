import React, { useState, useEffect } from "react";
import axios from "axios";

function ResultHistory() {
  const [isLoading, setIsLoading] = useState(true);
  const [resultData, setResultData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:3000/results")
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

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const handleSearch = () => {
    const filtered = resultData.filter((item) => {
      const itemDateString = formatDate(item.date);
      const startString = startDate ? formatDate(startDate) : null;
      const endString = endDate ? formatDate(endDate) : null;

      return (
        (!startString || itemDateString >= startString) &&
        (!endString || itemDateString <= endString)
      );
    });

    setFilteredData(filtered);
  };

  const handleImageClick = (imagePath) => {
    setSelectedImage(imagePath);
  };

  const handleCloseModal = (e) => {
    if (e.target === e.currentTarget) {
      setSelectedImage(null);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 p-8 bg-gray-50">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Result History</h1>
        </header>

        {/* ช่องเลือกช่วงวันที่ */}
        <div className="flex items-center gap-4 mb-8">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 border rounded-lg w-40 shadow-md focus:ring-2 focus:ring-blue-400"
          />
          <span className="text-lg text-gray-800">~</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 border rounded-lg w-40 shadow-md focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transform hover:scale-105 transition duration-200"
          >
            Search
          </button>
        </div>

        {/* ตารางข้อมูล */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full bg-white rounded-lg shadow-lg border border-gray-200 table-fixed">
            <thead className="bg-blue-600 text-white rounded-t-lg">
              <tr>
                <th className="p-2 border w-24 rounded-tr-lg text-white">Date</th>
                <th className="p-2 border w-40 text-white">Image</th>
                <th className="p-2 border w-32 text-white">Filename</th>
                <th className="p-2 border w-24 text-white">Process</th>
                <th className="p-2 border w-24 rounded-tr-lg text-white">Saved Data</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="text-center p-4 text-gray-800">Loading...</td>
                </tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((item, index) => {
                  const imagePath = `http://localhost:3000/${item.image}`;

                  return (
                    <tr key={index} className="text-center hover:bg-gray-100 border-b border-gray-200">
                      <td className="p-2 border rounded-l-lg text-gray-800">{formatDate(item.date)}</td>

                      <td
                        className="p-2 border w-44 cursor-pointer"
                        onClick={() => handleImageClick(imagePath)}
                      >
                        <div className="w-40 h-40 mx-auto rounded-lg bg-gray-200 flex items-center justify-center">
                          <img
                            src={imagePath}
                            alt="Result"
                            className="w-full h-full object-contain rounded-lg shadow"
                            onError={(e) => { e.target.src = "https://via.placeholder.com/160?text=No+Image"; }}
                          />
                        </div>
                      </td>

                      <td className="p-2 border w-32 overflow-hidden break-words whitespace-normal text-gray-800" title={item.filename}>
                        {item.filename}
                      </td>

                      <td className="p-2 border w-24 text-gray-800">
                        {Number(item.process_status) === 1 ? 'Completed' : 'Not Completed'}
                      </td>
                      <td className="p-2 border w-24 rounded-r-lg text-gray-800">
                        {Number(item.save_status) === 1 ? 'Saved' : 'Not Saved'}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-4 text-gray-800">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal สำหรับดูรูปขยาย */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          onClick={handleCloseModal}
        >
          <div className="relative w-auto h-auto p-4">
            <img
              src={selectedImage}
              alt="Zoomed"
              className="max-w-full max-h-full object-contain"
            />
            <button
              className="absolute top-2 right-2 w-10 h-10 flex items-center justify-center text-white text-2xl font-bold bg-gray-800 hover:bg-gray-900 rounded-full shadow-md"
              onClick={handleCloseModal}
            >
              &times;
            </button>

          </div>
        </div>
      )}
    </div>
  );
}

export default ResultHistory;



