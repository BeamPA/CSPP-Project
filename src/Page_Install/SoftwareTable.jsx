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

  const handleInstall = async (tableIndex = null) => {
    if (tableIndex === null) {
      setInstallingAll(true);
      const toInstall = softwareData.reduce((acc, group, groupIndex) => {
        if (!installed[groupIndex]) acc.push(groupIndex); // เลือกซอฟต์แวร์ที่ยังไม่ได้ติดตั้ง
        return acc;
      }, []);

      const initialProgress = toInstall.reduce((acc, groupIndex) => {
        acc[groupIndex] = 0; // กำหนดค่าความคืบหน้าของการติดตั้งเริ่มต้นเป็น 0
        return acc;
      }, {});
      setProgress(initialProgress);

      for (let i = 0; i < toInstall.length; i++) {
        const groupIndex = toInstall[i];

        await fetch(`/api/install/installSoftware`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            software_id: softwareData[groupIndex].software_id,
          }),
        })
          .then(() => {
            setProgress((prev) => {
              const newProgress = { ...prev };
              newProgress[groupIndex] = 100;
              return newProgress;
            });
            setInstalled((prev) => {
              const updated = { ...prev };
              updated[groupIndex] = true;
              return updated;
            });
          })
          .catch((error) => {
            console.error("Error installing software:", error);
            setProgress((prev) => {
              const newProgress = { ...prev };
              newProgress[groupIndex] = 0;
              return newProgress;
            });
          });

        await new Promise((resolve) => setTimeout(resolve, 500)); // หน่วง 500ms
      }

      setInstallingAll(false);
      setInstallAllDone(true);
    } else {
      const groupIndex = tableIndex;

      setProgress((prev) => ({ ...prev, [groupIndex]: 0 }));

      await fetch(`/api/install/installSoftware`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          software_id: softwareData[groupIndex].software_id,
        }),
      })
        .then(() => {
          setProgress((prev) => {
            const newProgress = { ...prev };
            newProgress[groupIndex] = 100;
            return newProgress;
          });
          setInstalled((prev) => {
            const updated = { ...prev };
            updated[groupIndex] = true;
            return updated;
          });
        })
        .catch((error) => {
          console.error("Error installing software:", error);
          setProgress((prev) => {
            const newProgress = { ...prev };
            newProgress[groupIndex] = 0;
            return newProgress;
          });
        });
    }
  };

  const handleUninstall = (tableIndex) => {
    if (installed[tableIndex] !== true) return; // ถ้ายังไม่ได้ติดตั้ง ไม่ต้องทำอะไร

    fetch(`/api/install/uninstallSoftware`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        software_id: softwareData[tableIndex]?.software_id, // ส่งค่า ID ไปที่เซิร์ฟเวอร์
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setInstalled((prev) => ({
            ...prev,
            [tableIndex]: false, // อัปเดตสถานะให้เป็นไม่ได้ติดตั้ง
          }));
        } else {
          console.error("Uninstall failed:", data.message);
        }
      })
      .catch((error) => {
        console.error("Error uninstalling software:", error);
      });
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
            installAllDone ? handleUninstall : () => handleInstall(null)
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
                {progress[groupIndex] !== undefined && progress[groupIndex] < 100 && (
                  <div className="h-2 bg-gray-300 rounded-full">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${progress[groupIndex]}%` }}
                    ></div>
                  </div>
                )}
              </div>
              {/* Hide Install button for software_id 16 */}
              {softwareData[groupIndex].software_id !== 16 && (
                <button
                  className={`px-4 py-2 rounded text-white ${
                    installed[groupIndex] === true
                      ? "bg-red-500"
                      : installed[groupIndex] === false
                      ? "bg-blue-500"
                      : "bg-gray-500 cursor-not-allowed"
                  }`}
                  onClick={
                    () =>
                      installed[groupIndex] === true
                        ? handleUninstall(groupIndex)
                        : handleInstall(groupIndex, false)
                  }
                  disabled={installed[groupIndex] === null} // Disable button if installation is not possible
                >
                  {installed[groupIndex] === true ? "Uninstall" : "Install"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

}

export default SoftwareTable;
