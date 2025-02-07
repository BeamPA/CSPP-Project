import { useState } from "react";

const isrData = [
  {
    title: "CSPP HEAP NUCAPS CrIS/ATMS IASI/AMSUA/MHS Retrieval Package Version 2.0  11 January 2022",
    files: [
      {
        name: "HEAP NUCAPS V2.0 EDR Software Installation Instructions",
        filename:
          "https://bin.ssec.wisc.edu/pub/CSPP/hidden/HEAP/v2.0/CSPP_HEAP_Installation_Guide_v2.0.pdf",
        size: "5.3 MB",
      },
      {
        name: "HEAP NUCAPS V2.0 EDR Retrieval Software for Linux",
        filename:
          "https://bin.ssec.wisc.edu/pub/CSPP/hidden/HEAP/v2.0/CSPP_HEAP_V2.0.tar",
        size: "5.3 MB",
      },
      {
        name: "HEAP NUCAPS V2.0 EDR Retrieval Test Data",
        filename:
          "https://bin.ssec.wisc.edu/pub/CSPP/hidden/HEAP/v2.0/CSPP_HEAP_TESTDATA_V2.0.tar.gz",
        size: "5.3 MB",
      },
    ],
  },
  {
    title: "CSPP UW Hyperspectral Retrieval Package Version 2.0 22 June 2018",
    files: [
      {
        name: "CrIS, AIRS and IASI Wisconsin Dual Regression Retrieval Software Installation Instructions",
        filename:
          "https://bin.ssec.wisc.edu/pub/CSPP/hidden/CrIS/EDR/hsrtv/v2.0/CSPP_HSRTV_Installation_Guide_v2.0a.pdf",
        size: "5.3 MB",
      },
      {
        name: "CrIS, AIRS and IASI EDR Dual Regression Retrieval Software for Linux",
        filename:
          "https://bin.ssec.wisc.edu/pub/CSPP/hidden/CrIS/EDR/hsrtv/v2.0/CSPP_UW_HSRTV_V2.0.tar.gz",
        size: "5.3 MB",
      },
      {
        name: "CrIS, AIRS and IASI EDR Dual Regression Coefficient Files",
        filename:
          "https://bin.ssec.wisc.edu/pub/CSPP/hidden/CrIS/EDR/hsrtv/v2.0/CSPP_UW_HSRTV_V2.0_COEFFS.tar.gz",
        size: "5.3 MB",
      },
    ],
  },
];

function ISR() {
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(null);
  const [progress, setProgress] = useState({});
  const [installed, setInstalled] = useState({});

  const allInstalled = Object.values(installed).length === isrData.length && Object.values(installed).every((val) => val);

  const handleInstall = (tableIndex = null, uninstall = false) => {
    if (tableIndex === null) {
      setLoading(true);
      const toInstall = isrData.reduce((acc, _, index) => {
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
        <h1 className="text-xl font-bold"> CSPP Infrared Sounder Retrieval Software</h1>
        {isrData.length > 1 && (
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
        {isrData.map((table, tableIndex) => (
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

export default ISR;
