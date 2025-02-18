import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function SoftwareTable() {
  const { category } = useParams();
  const [softwareData, setSoftwareData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState({});
  const [installed, setInstalled] = useState({});
  const [installingAll, setInstallingAll] = useState(false);
  const [installAllDone, setInstallAllDone] = useState(false);

  //console.log("Current Category:", category);

  useEffect(() => {
    if (category) {
      setLoading(true);
      fetch(`/api/install/software-files?categories=${category}`)
        .then((response) => response.json())
        .then((data) => {
          //console.log("API Response:", data);

          if (data.software_files && data.software_files.length > 0) {
            setSoftwareData(
              data.software_files.map((s) => ({
                title: s.title,
                files: s.software_files,
                software_id: s.software_id,
                status: s.status,
              }))
            );
            const initialInstalledStatus = data.software_files.reduce(
              (acc, group, groupIndex) => {
                acc[groupIndex] =
                  group.status === 1 ? true : group.status === 0 ? false : null;
                return acc;
              },
              {}
            );
            setInstalled(initialInstalledStatus);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data: ", error);
          setLoading(false);
        });
    }
  }, [category]);

  const shortenFilename = (filename) => {
    const fileParts = filename.split("/");
    return fileParts[fileParts.length - 1];
  };

  // ฟังก์ชั่นสำหรับการส่งคำขอไปยัง backend เพื่อบันทึกสถานะการติดตั้ง
  const updateInstallationStatus = (id, status) => {
    console.log("Sending Update Request:", { software_id: id, status }); // ตรวจสอบค่าที่ส่งไป
    if (id === undefined || id === null) {
      console.error("Invalid software_id:", id);
      return;
    }

    fetch("/api/install/update-status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        software_id: id, // ตรวจสอบว่า id ไม่เป็น undefined หรือ null
        status: status ? 1 : 0, // 1 = ติดตั้งแล้ว, 0 = ยังไม่ติดตั้ง
      }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(
              `Failed to update status: ${response.status} - ${text}`
            );
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log("Status Updated:", data);
      })
      .catch((error) => {
        console.error("Error updating status:", error);
      });
  };

  const handleInstall = (tableIndex = null, uninstall = false) => {
    console.log("Installing software, tableIndex:", tableIndex, "software_id:", softwareData[tableIndex]?.software_id);
  
    // Install all
    if (tableIndex === null) {
      setInstallingAll(true);
      const toInstall = softwareData.reduce((acc, group, groupIndex) => {
        if (!installed[groupIndex]) acc.push(groupIndex);
        return acc;
      }, []);
  
      const initialProgress = toInstall.reduce((acc, groupIndex) => {
        acc[groupIndex] = 0; // กำหนดค่าความคืบหน้าของการติดตั้งเริ่มต้นเป็น 0
        return acc;
      }, {});
      setProgress(initialProgress);
  
      const interval = setInterval(() => {
        setProgress((prev) => {
          let allDone = true;
          const newProgress = { ...prev };
  
          toInstall.forEach((groupIndex) => {
            if (newProgress[groupIndex] < 100) {
              newProgress[groupIndex] += 10;
              allDone = false;
              const software_id = softwareData[groupIndex].software_id;
              updateInstallationStatus(software_id, !uninstall);
            }
          });
  
          if (allDone) {
            clearInterval(interval);
            setInstallAllDone(true);
            setInstallingAll(false);
            setInstalled((prev) => {
              const updated = { ...prev };
              toInstall.forEach((groupIndex) => {
                updated[groupIndex] = !uninstall; // กำหนดสถานะการติดตั้งให้เป็นจริง
              });
              return updated;
            });
          }
  
          return newProgress;
        });
      }, 300); // ตรวจสอบสถานะทุก 300ms
    } else {
      // Install specific item
      setProgress((prev) => ({ ...prev, [tableIndex]: 0 }));
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev[tableIndex] >= 100) {
            clearInterval(interval);
            setInstalled((prev) => ({
              ...prev,
              [tableIndex]: !uninstall,
            }));
            const software_id = softwareData[tableIndex].software_id;
            updateInstallationStatus(software_id, !uninstall);
            return prev;
          }
          return { ...prev, [tableIndex]: prev[tableIndex] + 10 }; // เพิ่มความคืบหน้าทีละ 10%
        });
      }, 300);
    }
  };
  
  const handleUninstallAll = () => {
    setInstallingAll(true);
    const toUninstall = softwareData.reduce((acc, group, groupIndex) => {
      if (installed[groupIndex]) acc.push(groupIndex);
      return acc;
    }, []);
  
    const initialProgress = toUninstall.reduce((acc, groupIndex) => {
      acc[groupIndex] = 0;
      return acc;
    }, {});
    setProgress(initialProgress);
  
    const interval = setInterval(() => {
      setProgress((prev) => {
        let allDone = true;
        const newProgress = { ...prev };
  
        toUninstall.forEach((groupIndex) => {
          if (newProgress[groupIndex] < 100) {
            newProgress[groupIndex] += 10;
            allDone = false;
            const software_id = softwareData[groupIndex].software_id;
            updateInstallationStatus(software_id, false); // ส่งค่า false เพราะต้องการถอนการติดตั้ง
          }
        });
  
        if (allDone) {
          clearInterval(interval);
          setInstallAllDone(false);
          setInstallingAll(false);
          setInstalled((prev) => {
            const updated = { ...prev };
            toUninstall.forEach((groupIndex) => {
              updated[groupIndex] = false; // อัพเดทสถานะการติดตั้งให้เป็น false
            });
            return updated;
          });
        }
  
        return newProgress;
      });
    }, 300);
  };
  

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">
          {category || "No category selected"}
        </h1>
        {softwareData.length > 1 && (
          <button
            className={`px-6 py-2 rounded flex items-center gap-2 ${
              installingAll || loading
                ? "bg-gray-500 cursor-not-allowed"
                : installAllDone
                ? "bg-red-500"
                : "bg-green-500"
            } text-white`}
            onClick={
              installAllDone ? handleUninstallAll : () => handleInstall(null)
            }
            disabled={installingAll || loading}
          >
            {installingAll
              ? installAllDone
                ? "Uninstall All"
                : "Installing All..."
              : installAllDone
              ? "Uninstall All"
              : "Install All"}
          </button>
        )}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="mt-6 bg-white shadow-lg rounded-lg p-4 max-h-[800px] overflow-y-auto">
          {softwareData.map((group, groupIndex) => (
            <div
              key={groupIndex}
              className="mb-6 border rounded-lg overflow-hidden"
            >
              <table className="min-w-full table-fixed">
                <thead className="bg-[#0E3B61] text-white">
                  <tr>
                    <th colSpan="3" className="px-4 py-2 text-left text-lg">
                      {group.title}
                    </th>
                  </tr>
                  <tr>
                    <th className="px-4 py-2 text-left w-1/3">Software Name</th>
                    <th className="px-4 py-2 text-left w-1/3">File Name</th>
                    <th className="px-4 py-2 text-left w-1/3">File Size</th>
                  </tr>
                </thead>
                <tbody>
                  {group.files.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-2">{item.name}</td>
                      <td className="px-4 py-2">
                        {item.filename ? (
                          <a
                            href={item.filename}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                          >
                            {shortenFilename(item.filename)}
                          </a>
                        ) : (
                          <span className="text-gray-500">Not Available</span>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        {item.size ?? "Not Available"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="px-4 py-4 flex justify-between items-center">
                <div className="w-1/3">
                  {progress[groupIndex] !== undefined &&
                    progress[groupIndex] < 100 && (
                      <div className="h-2 bg-gray-300 rounded-full">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${progress[groupIndex]}%` }}
                        ></div>
                      </div>
                    )}
                </div>
                <button
                  className={`px-4 py-2 rounded text-white ${
                    installed[groupIndex] === true
                      ? "bg-red-500"
                      : installed[groupIndex] === false
                      ? "bg-blue-500"
                      : "bg-gray-500 cursor-not-allowed"
                  }`}
                  onClick={() =>
                    handleInstall(groupIndex, installed[groupIndex])
                  }
                  disabled={installed[groupIndex] === null} // Disable button if installation is not possible
                >
                  {installed[groupIndex] === true
                    ? "Uninstall"
                    : installed[groupIndex] === false
                    ? "Install"
                    : "Cannot Install"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SoftwareTable;
