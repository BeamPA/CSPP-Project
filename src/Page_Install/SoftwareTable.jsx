import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

function SoftwareTable() {
  const { category } = useParams();
  const [softwareData, setSoftwareData] = useState([]);
  const [loading, setLoading] = useState(true);
  //const [progress, setProgress] = useState({});
  const [installed, setInstalled] = useState({});
  const [installingAll, setInstallingAll] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [installingSoftware, setInstallingSoftware] = useState({});

  useEffect(() => {
    // ตรวจสอบ sessionStorage ว่ามีข้อมูลการติดตั้งที่ค้างไว้หรือไม่
    const storedProcessing = sessionStorage.getItem("processing");
    const storedInstallingSoftware = sessionStorage.getItem("installingSoftware");
  
    if (storedProcessing) {
      setProcessing(true);
    }
  
    if (storedInstallingSoftware) {
    setInstallingSoftware(JSON.parse(storedInstallingSoftware));
  }
  
    if (category) {
      setLoading(true);
      fetch(`/api/install/software-files?categories=${category}`)
        .then((response) => response.json())
        .then((data) => {
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
  

  useEffect(() => {
    // ปรับปรุงสถานะการติดตั้งเมื่อมีการเปลี่ยนแปลง
    console.log("Installed status updated:", installed);
  }, [installed]);

  const shortenFilename = (filename) => {
    const fileParts = filename.split("/");
    return fileParts[fileParts.length - 1];
  };

  const installedCount = Object.values(installed).filter(
    (status) => status === true
  ).length;
  const totalSoftware = softwareData.length;
  const moreThanHalfInstalled = installedCount > totalSoftware / 2;

  const handleInstall = async (tableIndex = null) => {
    if (processing) return;
    setProcessing(true);
    sessionStorage.setItem("processing", "true");
  
    let newInstallingSoftware = { ...installingSoftware };
  
    if (tableIndex === null) {
      setInstallingAll(true);
      const toInstall = softwareData.reduce((acc, group, groupIndex) => {
        if (!installed[groupIndex] && group.software_id !== 16) acc.push(groupIndex);
        return acc;
      }, []);
  
      for (let i = 0; i < toInstall.length; i++) {
        const groupIndex = toInstall[i];
        newInstallingSoftware[groupIndex] = true;
        setInstallingSoftware({ ...newInstallingSoftware });
        sessionStorage.setItem("installingSoftware", JSON.stringify(newInstallingSoftware));
  
        try {
          await fetch(`/api/install/installSoftware`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              software_id: softwareData[groupIndex].software_id,
            }),
          });
  
          setInstalled((prev) => ({ ...prev, [groupIndex]: true }));
        } catch (error) {
          console.error("Error installing software:", error);
        }
  
        delete newInstallingSoftware[groupIndex];
        setInstallingSoftware({ ...newInstallingSoftware });
        sessionStorage.setItem("installingSoftware", JSON.stringify(newInstallingSoftware));
      }
  
      setInstallingAll(false);
      Swal.fire({
        icon: "success",
        title: `ติดตั้งทั้งหมดเสร็จสมบูรณ์!`,
        text: `ซอฟต์แวร์ทั้งหมดในหมวด "${category}" ถูกติดตั้งเรียบร้อยแล้ว`,
      }).then((result) => {
        if (result.isConfirmed) window.location.reload();
      });
    } else {
      newInstallingSoftware[tableIndex] = true;
      setInstallingSoftware({ ...newInstallingSoftware });
      sessionStorage.setItem("installingSoftware", JSON.stringify(newInstallingSoftware));
  
      try {
        await fetch(`/api/install/installSoftware`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            software_id: softwareData[tableIndex].software_id,
          }),
        });
  
        setInstalled((prev) => ({ ...prev, [tableIndex]: true }));
  
        Swal.fire({
          icon: "success",
          title: "ติดตั้งสำเร็จ!",
          text: `${softwareData[tableIndex].title} ถูกติดตั้งเรียบร้อยแล้ว`,
        }).then((result) => {
          if (result.isConfirmed) window.location.reload();
        });
      } catch (error) {
        console.error("Error installing software:", error);
      }
  
      delete newInstallingSoftware[tableIndex];
      setInstallingSoftware({ ...newInstallingSoftware });
      sessionStorage.setItem("installingSoftware", JSON.stringify(newInstallingSoftware));
    }
  
    setProcessing(false);
    sessionStorage.removeItem("processing");
  };
  
  
  const handleUninstall = async (tableIndex = null) => {
    if (processing) return;
    setProcessing(true);
    sessionStorage.setItem("processing", "true");

    const toUninstall = tableIndex !== null ? [tableIndex] : Object.keys(installed).filter(key => installed[key] === true);
    setInstallingAll(true);

    let successfulUninstalls = []; 
    let failedUninstalls = []; 

    for (let i = 0; i < toUninstall.length; i++) {
        const groupIndex = toUninstall[i];

        if (installed[groupIndex] !== true) continue;
        setInstallingSoftware((prev) => ({ ...prev, [groupIndex]: true }));

        try {
            const response = await fetch(`/api/install/uninstallSoftware`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    software_id: softwareData[groupIndex]?.software_id,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setInstalled((prev) => ({ ...prev, [groupIndex]: false }));
                successfulUninstalls.push(softwareData[groupIndex]?.title || "ซอฟต์แวร์");
            } else {
                failedUninstalls.push(softwareData[groupIndex]?.title || "ซอฟต์แวร์");
                console.error("Uninstall failed:", data.message);
            }
        } catch (error) {
            console.error("Error uninstalling software:", error);
            failedUninstalls.push(softwareData[groupIndex]?.title || "ซอฟต์แวร์");
        }

        setInstallingSoftware((prev) => ({ ...prev, [groupIndex]: false }));
        await new Promise((resolve) => setTimeout(resolve, 500));
    }

    setInstallingAll(false);
    setProcessing(false);
    sessionStorage.removeItem("processing");

    // 🔹 แสดงแจ้งเตือนให้ถูกต้อง
    if (successfulUninstalls.length > 0 && failedUninstalls.length === 0) {
        Swal.fire({
            icon: 'success',
            title: tableIndex !== null ? 'ถอนการติดตั้งสำเร็จ!' : 'การถอนการติดตั้งทั้งหมดเสร็จสิ้น!',
            text: tableIndex !== null
                ? `${successfulUninstalls.join(", ")} ได้รับการถอนการติดตั้งเรียบร้อยแล้ว.`
                : `ซอฟต์แวร์ทั้งหมดในหมวด "${category}" ถูกถอนการติดตั้งเรียบร้อยแล้ว.`,
        }).then((result) => {
            if (result.isConfirmed) window.location.reload();
        });

    } else if (successfulUninstalls.length > 0 && failedUninstalls.length > 0) {
        Swal.fire({
            icon: 'warning',
            title: 'การถอนการติดตั้งเสร็จสิ้นบางส่วน!',
            text: `ซอฟต์แวร์ต่อไปนี้ถูกถอนการติดตั้งเรียบร้อยแล้ว: ${successfulUninstalls.join(", ")}\n\nแต่ซอฟต์แวร์ต่อไปนี้ไม่สามารถถอนการติดตั้งได้: ${failedUninstalls.join(", ")}`,
        });

    } else if (successfulUninstalls.length === 0 && failedUninstalls.length > 0) {
        Swal.fire({
            icon: 'error',
            title: 'การถอนการติดตั้งล้มเหลว!',
            text: `ไม่สามารถถอนการติดตั้งซอฟต์แวร์ต่อไปนี้ได้: ${failedUninstalls.join(", ")} กรุณาลองใหม่.`,
        });
    }
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
              installingAll || loading || processing
                ? "bg-gray-500 cursor-not-allowed"
                : moreThanHalfInstalled
                ? "bg-red-500"
                : "bg-green-500"
            } text-white`}
            onClick={
              moreThanHalfInstalled
                ? () => handleUninstall() // เรียก handleUninstall เมื่อเลือกถอนการติดตั้งทั้งหมด
                : () => handleInstall(null)
            }
            disabled={installingAll || loading || processing}
          >
            {installingAll || processing
              ? "Processing..."
              : moreThanHalfInstalled
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
                  {installingSoftware[groupIndex] && (
                    <progress className="progress w-56"></progress>
                  )}
                </div>
                {softwareData[groupIndex].software_id !== 16 && (
                  <button
                    className={`px-4 py-2 rounded text-white ${
                      installed[groupIndex] === true
                        ? "bg-red-500"
                        : installed[groupIndex] === false
                        ? "bg-blue-500"
                        : "bg-gray-500 cursor-not-allowed"
                    }`}
                    onClick={() =>
                      installed[groupIndex] === true
                        ? handleUninstall(groupIndex)
                        : handleInstall(groupIndex)
                    }
                    disabled={installed[groupIndex] === null || processing}
                  >
                    {installed[groupIndex] === true
                      ? "Uninstall"
                      : installed[groupIndex] === false
                      ? "Install"
                      : "Processing..."}
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
