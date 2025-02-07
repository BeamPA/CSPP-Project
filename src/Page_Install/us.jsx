import { useState } from "react";

const usData = [
  {
    title:
      "Real-time Software Telemetry Processing System (RT-STPS) Version 7.0 with Patch 1  22 May 2024",
    files: [
      {
        name: "RT-STPS Version 7.0 Users' Guide",
        filename:
          "https://bin.ssec.wisc.edu/pub/CSPP/hidden/RT-STPS/v7.0_patch1/RT-STPS_7.0_Users_Guide.pdf",
        size: "5.3 MB",
      },
      {
        name: "CSPP RT-STPS Addendum",
        filename:
          "https://bin.ssec.wisc.edu/pub/CSPP/hidden/RT-STPS/v7.0_patch1/RT-STPS_7.0_Patch_Addendum.txt",
        size: "5.3 MB",
      },
      {
        name: "RT-STPS Version 7.0 Patch 1 Readme File",
        filename:
          "https://bin.ssec.wisc.edu/pub/CSPP/hidden/RT-STPS/v7.0_patch1/RT-STPS_7.0_PATCH_1_README.txt",
        size: "5.3 MB",
      },
      {
        name: "RT-STPS Version 7.0 Software for Linux",
        filename:
          "https://bin.ssec.wisc.edu/pub/CSPP/hidden/RT-STPS/v7.0/RT-STPS_7.0.tar.gz",
        size: "5.3 MB",
      },
      {
        name: "RT-STPS Version 7.0 Test Data",
        filename:
          "https://bin.ssec.wisc.edu/pub/CSPP/hidden/RT-STPS/v7.0/RT-STPS_7.0_testdata.tar.gz",
        size: "5.3 MB",
      },
      {
        name: "RT-STPS Version 7.0 Patch 1 for Linux",
        filename:
          "https://bin.ssec.wisc.edu/pub/CSPP/hidden/RT-STPS/v7.0_patch1/RT-STPS_7.0_PATCH_1.tar.gz",
        size: "5.3 MB",
      },
      {
        name: "RT-STPS Version 7.0 Patch 1 Test Data",
        filename:
          "https://bin.ssec.wisc.edu/pub/CSPP/hidden/RT-STPS/v7.0_patch1/RT-STPS_7.0_PATCH_1_testdata.tar.gz",
        size: "5.3 MB",
      },
      {
        name: "RT-STPS Version 7.0 Source Code (not required)",
        filename:
          "https://bin.ssec.wisc.edu/pub/CSPP/hidden/RT-STPS/v7.0/RT-STPS_7.0_SOURCE_CODE.tar.gz",
        size: "5.3 MB",
      },
    ],
  },
  {
    title: "CSPP Sounder QuickLook (QL) Software for HEAP NUCAPS, HSRTV, MIRS and IAPP Retrievals 1 March 2024",
    files: [
      {
        name: "Sounder Quicklook Software Installation Instructions",
        filename:
          "https://bin.ssec.wisc.edu/pub/CSPP/hidden/QL/v1.3/CSPP_Sounder_QL_Installation_Guide_v1.3.pdf",
        size: "5.3 MB",
      },
      {
        name: "Sounder Quicklook Software for Linux",
        filename:
          "https://bin.ssec.wisc.edu/pub/CSPP/hidden/QL/v1.3/cspp-sounder-ql-1.3.tar.gzhttps://bin.ssec.wisc.edu/pub/CSPP/hidden/QL/v1.3/cspp-sounder-ql-1.3.tar.gz",
        size: "5.3 MB",
      },
      {
        name: "Sounder Quicklook Test Files",
        filename:
          "https://bin.ssec.wisc.edu/pub/CSPP/hidden/P2G/v3.1/Polar2Grid_Documentation_3.1.pdf",
        size: "5.3 MB",
      },
    ],
  },
  {
    title:
      "Polar2Grid Reprojection Software for VIIRS, MODIS, AVHRR and Science Products 20 August 2024",
    files: [
      {
        name: "Polar2Grid V3.1 Reprojection Software Installation Instructions",
        filename:
          "https://bin.ssec.wisc.edu/pub/CSPP/hidden/LSR/v1.1/CSPP_LSR_Installation_Guide_v1.1a.pdf",
        size: "5.3 MB",
      },
      {
        name: "VIIRS Surface Reflectance 1.1 Software for Linux",
        filename:
          "https://bin.ssec.wisc.edu/pub/CSPP/hidden/P2G/v3.1/Polar2Grid_Documentation_3.1.pdf",
        size: "5.3 MB",
      },
      {
        name: "Polar2Grid V3.1 Reprojection Software Test Files",
        filename:
          "https://bin.ssec.wisc.edu/pub/CSPP/hidden/P2G/v3.1/CSPP_POLAR2GRID_V3.1_TEST_DATA.tar.gz",
        size: "5.3 MB",
      },
    ],
  },
];

function US() {
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(null);
  const [progress, setProgress] = useState({});
  const [installed, setInstalled] = useState({});

  const allInstalled = Object.values(installed).length === usData.length && Object.values(installed).every((val) => val);

  const handleInstall = (tableIndex = null, uninstall = false) => {
    if (tableIndex === null) {
      setLoading(true);
      const toInstall = usData.reduce((acc, _, index) => {
        if (!installed[index]) acc.push(index);
        return acc;
      }, []);

      if (toInstall.length === 0) {
        uninstall = true;
        toInstall.push(...Object.keys(installed).map(Number));
      }

      const initialProgress = toInstall.reduce((acc, index) => {
        acc[index] = 0;
        return acc;
      }, {});
      setProgress(initialProgress);

      const interval = setInterval(() => {
        setProgress((prev) => {
          let allDone = true;
          const newProgress = { ...prev };

          toInstall.forEach((index) => {
            if (newProgress[index] < 100) {
              newProgress[index] += 10;
              allDone = false;
            }
          });

          if (allDone) {
            clearInterval(interval);
            setLoading(false);
            setInstalled((prev) => {
              const updated = { ...prev };
              toInstall.forEach((index) => {
                updated[index] = !uninstall;
              });
              return updated;
            });
          }
          return newProgress;
        });
      }, 300);
    } else {
      setTableLoading(tableIndex);
      setProgress((prev) => ({ ...prev, [tableIndex]: 0 }));
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev[tableIndex] >= 100) {
            clearInterval(interval);
            setTableLoading(null);
            setInstalled((prev) => ({ ...prev, [tableIndex]: !uninstall }));
            return prev;
          }
          return { ...prev, [tableIndex]: prev[tableIndex] + 10 };
        });
      }, 300);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">CSPP Utility Software</h1>
        {usData.length > 1 && (
          <button
          className={`px-6 py-2 rounded flex items-center gap-2 ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : allInstalled
              ? "bg-red-500" // สีแดงเมื่อเป็น "Uninstall All"
              : "bg-green-500" // สีเขียวเมื่อเป็น "Install All"
          } text-white`}
          onClick={() => handleInstall(null, allInstalled)}
          disabled={loading}
        >
          {loading ? (allInstalled ? "Uninstalling..." : "Installing...") : allInstalled ? "Uninstall all" : "Install all"}
        </button>
        )}
      </div>
      <div className="mt-6 bg-white shadow-lg rounded-lg p-4 max-h-[800px] overflow-y-auto">
        {usData.map((table, tableIndex) => (
          <div key={tableIndex} className="mb-6 border rounded-lg overflow-hidden">
            <table className="min-w-full table-fixed">
              <thead className="bg-[#0E3B61] text-white">
                <tr>
                  <th className="px-4 py-2 text-left w-1/3">{table.title}</th>
                  <th className="px-4 py-2 text-left w-1/2">File name</th>
                  <th className="px-4 py-2 text-left w-1/2">File size</th>
                </tr>
              </thead>
              <tbody>
                {table.files.map((file, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2">{file.name}</td>
                    <td className="px-4 py-2">
                      <a href={file.filename} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                        {file.filename.split("/").pop()}
                      </a>
                    </td>
                    <td className="px-4 py-2">{file.size}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-4 py-4 flex justify-between items-center">
              <div className="w-1/3">
                {progress[tableIndex] !== undefined && progress[tableIndex] < 100 && (
                  <div className="h-2 bg-gray-300 rounded-full">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${progress[tableIndex]}%` }}></div>
                  </div>
                )}
              </div>
              <button
                className={`px-4 py-2 rounded text-white ${tableLoading === tableIndex ? "bg-gray-500 cursor-not-allowed" : installed[tableIndex] ? "bg-red-500" : "bg-blue-500"}`}
                onClick={() => handleInstall(tableIndex, installed[tableIndex])}
                disabled={tableLoading === tableIndex}
              >
                {tableLoading === tableIndex ? (installed[tableIndex] ? "Uninstalling..." : "Installing...") : installed[tableIndex] ? "Uninstall" : "Install"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


export default US;
