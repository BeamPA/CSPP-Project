import { useState } from "react";
import Swal from "sweetalert2";
import icon from "../assets/arrow-up.png";
import axios from "axios";
import GridComponent from "./GridComponent";

function SNPPV2() {
  // #################################################################
  // State Management
  const [hoveredKey, setHoveredKey] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [buttonStates, setButtonStates] = useState(Object.fromEntries(initialKeys.map((key) => [key, "Off"])));
  const [startStates, setStartStates] = useState(Object.fromEntries(initialKeys.map((key) => [key, "Start"])));
  const [progressStates, setProgressStates] = useState(Object.fromEntries(initialKeys.map((key) => [key, 0])));
  const [fileName, setFileName] = useState("Import RDR file");

  const initialKeys = [
    "SDR", "EDR", "Flood Detection", "Active Fire", "ASCI EDR",
    "Surface Reflectance and Vegetation Index", "ACSPO SST", "CLAVRx Cloud Retrieval",
    "UW Hyperspectral Retrieval", "HEAP NUCAPS CrIS/ATMS IASI/AMSUA/MHS Retrieval", "MiRS Microwave Retrieval",
    "GCOMW-1 AMSR-2 GAASP", "IAPP", "Real-time Software Telemetry Processing System (RT-STPS)", "Sounder QuickLook (QL)",
    "Polar2Grid Reprojection", "S-NPP HYDRA2 Visualization and Analysis Toolkit"
  ];

  // #################################################################
  // API Call Functions

  const runCommand = async (key) => {
    try {
      setStartStates((prev) => ({ ...prev, [key]: "Stop" }));
      const response = await axios.get("http://localhost:5000/run-command");
      console.log("Command started:", response.data);
    } catch (error) {
      console.error("Error starting command:", error);
    }
  };

  const toggleStartStop = (key) => {
    if (buttonStates[key] === "On") {
      setStartStates((prevState) => {
        const newState = prevState[key] === "Start" ? "Stop" : "Start";

        if (newState === "Stop") {
          runCommand(key);

          // ตรวจสอบ progress ทุก ๆ 1 วินาที
          const interval = setInterval(async () => {
            try {
              const progressRes = await axios.get("http://localhost:5000/check-progress");
              const progress = progressRes.data.progress;
              setProgressStates((prev) => ({ ...prev, [key]: progress }));

              if (progress >= 100) {
                clearInterval(interval);
                Swal.fire({
                  title: "สำเร็จ!",
                  text: `${key} ทำงานเสร็จสิ้นแล้ว`,
                  icon: "success",
                  confirmButtonText: "ตกลง",
                });
              }
            } catch (error) {
              console.error("Error checking progress:", error);
            }
          }, 1000);
        } else {
          setProgressStates((prev) => ({ ...prev, [key]: 0 }));
        }

        return { ...prevState, [key]: newState };
      });
    }
  };

  // #################################################################
  // Event Handlers

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.name.endsWith(".h5")) {
        Swal.fire({
          title: "ไฟล์ไม่ถูกต้อง!",
          text: "กรุณาเลือกไฟล์ที่มีนามสกุล .h5 เท่านั้น",
          icon: "error",
          confirmButtonText: "ตกลง",
        });
        e.target.value = "";
        setFileName("Import RDR file");
        return;
      }
      setFileName(file.name);
    } else {
      setFileName("Import RDR file");
    }
  };

  const toggleButton = (key) => {
    setButtonStates((prevState) => {
      const newState = prevState[key] === "Off" ? "On" : "Off";
      if (newState === "Off") {
        setStartStates((prevStartStates) => ({ ...prevStartStates, [key]: "Start" }));
      }
      return { ...prevState, [key]: newState };
    });
  };

  const filteredKeys = initialKeys.filter((key) => key.toLowerCase().includes(searchQuery));

  // #################################################################


  return (
    <div>
      <div className="flex-1 p-10 bg-[#f5f5f5] overflow-hidden">
        {/* กล่อง Search */}
        <input
          type="text"
          placeholder="Search"
          className="w-full p-2 border border-gray-300 rounded-2xl mb-6"
          onChange={handleSearch}
        />

        {/* กล่องนำเข้า RDR file */}
        <div className="mb-4">
          <label
            htmlFor="file-upload"
            className="flex justify-between w-full items-center p-2 border border-gray-300 rounded-2xl cursor-pointer bg-white"
          >
            <span className="text-gray-700">{fileName}</span>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              accept=".h5"
              onChange={handleFileUpload}
            />
            <img src={icon} alt="icon" className="w-6" />
          </label>
        </div>

        {/* Grid Component */}
        <GridComponent
          filteredKeys={filteredKeys}
          buttonStates={buttonStates}
          startStates={startStates}
          progressStates={progressStates}
          toggleButton={toggleButton}
          toggleStartStop={toggleStartStop}
          runCommand={runCommand}
          setHoveredKey={setHoveredKey}
          hoveredKey={hoveredKey}
        />
      </div>
    </div>
  );
}

export default SNPPV2;
