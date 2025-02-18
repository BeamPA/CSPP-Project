import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Install() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  // ดึงข้อมูลจาก backend API เมื่อ component ถูกโหลด
  useEffect(() => {
    fetch("/api/install/categories")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          console.error("Data is not an array:", data);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);
  

  // ฟังก์ชันเมื่อกดเลือก category
  const handleCategoryClick = (category) => {
    navigate(`/CSPP/${encodeURIComponent(category)}`); // นำไปที่ /category/:category
  };

  // กรองข้อมูลจาก search term
  const filteredCategories = categories.filter((category) =>
    category.categories.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-h-screen w-full flex justify-center items-start">
      <div className="w-full max-w-6xl p-4">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 mb-4 border rounded-md shadow-sm"
        />

        <h1 className="text-2xl font-bold mb-6">Install</h1>

        <div className="max-h-[800px] overflow-y-auto">
          {filteredCategories.length > 0 ? (
            <div className="space-y-5">
              {filteredCategories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => handleCategoryClick(category.categories)}
                  className="w-full p-4 text-left bg-[#EDEDED] rounded-md shadow-md hover:shadow-lg transition duration-200 mb-3"
                >
                  {category.categories}
                </button>
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
