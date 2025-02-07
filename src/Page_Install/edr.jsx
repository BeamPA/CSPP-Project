import { useState } from "react";

const edrData = [
  {
    title: "VIIRS Active Fire Version 2.1 Software 5 October 2023",
    files: [
      {
        name: "VIIRS Active Fire Version 2.1 Installation Instructions",
        filename:
          "https://bin.ssec.wisc.edu/pub/CSPP/hidden/FIRE/v2.1/CSPP_Active_Fire_Installation_Guide_v2.1.pdf",
        size: "5.3 MB",
      },
      {
        name: "VIIRS Active Fire Version 2.1 Software for Linux",
        filename:
          "https://bin.ssec.wisc.edu/pub/CSPP/hidden/FIRE/v2.1/cspp-active-fire-noaa_2.1.tar.gz",
        size: "5.3 MB",
      },
      {
        name: "VIIRS Active Fire Version 2.1 Test Data",
        filename:
          "https://bin.ssec.wisc.edu/pub/CSPP/hidden/FIRE/v2.1/cspp-active-fire-test_data_2.1.tar.gz",
        size: "5.3 MB",
      },
    ],
  },
  {
    title: "VIIRS ASCI EDR Version 1.2 Software 14 February 2022",
    files: [
      {
        name: "VIIRS ASCI EDR Version 1.2 Installation Instructions",
        filename:
          "https://bin.ssec.wisc.edu/pub/CSPP/hidden/ASCI/v1.2/CSPP_ASCI_Installation_Guide_v1.2.pdf",
        size: "5.3 MB",
      },
      {
        name: "VIIRS ASCI EDR Version 1.2 Software for Linux",
        filename:
          "https://bin.ssec.wisc.edu/pub/CSPP/hidden/ASCI/v1.2/CSPP_VIIRS_ASCI_V1.2.tar.gz",
        size: "5.3 MB",
      },
      {
        name: "VIIRS ASCI EDR Version 1.2 Static Ancillary Files",
        filename:
          "https://bin.ssec.wisc.edu/pub/CSPP/hidden/ASCI/v1.2/CSPP_VIIRS_ASCI_V1.2_STATIC.tar.gz",
        size: "5.3 MB",
      },
      {
        name: "VIIRS ASCI EDR Version 1.2 Test Files",
        filename:
          "https://bin.ssec.wisc.edu/pub/CSPP/hidden/ASCI/v1.2/CSPP_VIIRS_ASCI_V1.2_TEST_DATA.tar.gz",
        size: "5.3 MB",
      },
    ],
  },
  {
    title:
      "VIIRS Surface Reflectance and Vegetation Index Version 1.1 Software    14 February 2022",
    files: [
      {
        name: "VIIRS Surface Reflectance Installation Instructions",
        filename:
          "https://bin.ssec.wisc.edu/pub/CSPP/hidden/LSR/v1.1/CSPP_LSR_Installation_Guide_v1.1a.pdf",
        size: "5.3 MB",
      },
      {
        name: "VIIRS Surface Reflectance 1.1 Software for Linux",
        filename:
          "https://bin.ssec.wisc.edu/pub/CSPP/hidden/LSR/v1.1/CSPP_VIIRS_SURFACE_REFLECTANCE_V1.1.tar.xz",
        size: "5.3 MB",
      },
      {
        name: "VIIRS Surface Reflectance 1.1 Test Data",
        filename:
          "https://bin.ssec.wisc.edu/pub/CSPP/hidden/LSR/v1.1/CSPP_VIIRS_SURFACE_REFLECTANCE_V1.1_TEST_DATA.tar.gz",
        size: "5.3 MB",
      },
    ],
  },
  {
    title: "ACSPO SST V2.0 Software 28 October 2021",
    files: [
      {
        name: "ACSPO V2.0 VIIRS, MODIS and AVHRR SST Retrieval Software Installation Instructions",
        filename:
          "https://bin.ssec.wisc.edu/pub/CSPP/hidden/ACSPO/v2.0/CSPP_ACSPO_Installation_Guide_v2.0.pdf",
        size: "5.3 MB",
      },
      {
        name: "ACSPO V2.0 VIIRS, MODIS and AVHRR SST Retrieval Software For Linux",
        filename:
          "https://bin.ssec.wisc.edu/pub/CSPP/hidden/ACSPO/v2.0/CSPP_ACSPO_V2.0.tar",
        size: "5.3 MB",
      },
      {
        name: "ACSPO V2.0 Test Files",
        filename:
          "https://bin.ssec.wisc.edu/pub/CSPP/hidden/ACSPO/v2.0/CSPP_ACSPO_TESTDATA_V2.0.tar.gz",
        size: "5.3 MB",
      },
    ],
  },
  {
    title: "VIIRS Flood Detection Version 1.1 Software 14 November 2018",
    files: [
      {
        name: "VIIRS Flood Detection V1.1 Installation Instructions",
        filename:
          "https://bin.ssec.wisc.edu/pub/CSPP/hidden/FLOOD/v1.1/CSPP_Flood_Detection_Installation_Guide_v1.1.pdf",
        size: "5.3 MB",
      },
      {
        name: "VIIRS Flood Detection V1.1 Software for Linux",
        filename:
          "https://bin.ssec.wisc.edu/pub/CSPP/hidden/FLOOD/v1.1/CSPP_FLOOD_1_1.tar.gz",
        size: "5.3 MB",
      },
      {
        name: "VIIRS Flood Detection V1.1 Test Data",
        filename:
          "https://bin.ssec.wisc.edu/pub/CSPP/hidden/FLOOD/v1.1/CSPP_FLOOD_1_1_TEST_DATA.tar.gz",
        size: "5.3 MB",
      },
    ],
  },
  {
    title: "CLAVRx Cloud Retrieval V3.0 Software  16 September 2019",
    files: [
      {
        name: "CLAVRx V3.0 VIIRS, MODIS and AVHRR Cloud Retrieval Software Installation Instructions",
        filename:
          "https://bin.ssec.wisc.edu/pub/CSPP/hidden/CLAVRx/v3.0/CSPP_CLAVRx_Installation_Guide_v3.0.pdf",
        size: "5.3 MB",
      },
      {
        name: "CLAVRx V3.0 VIIRS, MODIS and AVHRR Cloud Retrieval Software For Linux",
        filename:
          "https://bin.ssec.wisc.edu/pub/CSPP/hidden/CLAVRx/v3.0/CSPP_CLAVRX_V3.0.tar.xz",
        size: "5.3 MB",
      },
      {
        name: "CLAVRx V3.0 Static Ancillary Files",
        filename:
          "https://bin.ssec.wisc.edu/pub/CSPP/hidden/CLAVRx/v3.0/CSPP_CLAVRX_V3.0_STATIC.tar.xz",
        size: "5.3 MB",
      },
      {
        name: "CLAVRx V3.0 Test Files",
        filename:
          "https://bin.ssec.wisc.edu/pub/CSPP/hidden/CLAVRx/v3.0/CSPP_CLAVRX_V3.0_TEST_DATA.tar.gz",
        size: "5.3 MB",
      },
    ],
  },
];

function EDR() {
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(null);
  const [progress, setProgress] = useState({});
  const [installed, setInstalled] = useState({});

  const allInstalled = Object.values(installed).length === edrData.length && Object.values(installed).every((val) => val);

  const handleInstall = (tableIndex = null, uninstall = false) => {
    if (tableIndex === null) {
      setLoading(true);
      const toInstall = edrData.reduce((acc, _, index) => {
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
        <h1 className="text-xl font-bold"> CSPP Imager Environmental Data Record (EDR) Retrieval Software</h1>
        {edrData.length > 1 && (
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
        {edrData.map((table, tableIndex) => (
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

export default EDR;
