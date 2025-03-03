import { useState } from "react";
import Swal from "sweetalert2";
import icon from "../assets/arrow-up.png";
import axios from "axios";
import GridComponent from "./GridComponent";
import handleFileUpload from "./handleFileUpload";
function SNPPV2() {
  // ###########################State Management######################################
  const initialKeys = [
    "SDR", "EDR", "Flood", "LSR", "Fire", "ASCI","ACSPO", "CLAVRx", "HSRTV", "HEAP",
    "MIRS", "GAASP", "IAPP", "RT-STPS","QL", "POLAR2GRID", "HYDRA2"];

  const [hoveredKey, setHoveredKey] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [buttonStates, setButtonStates] = useState(Object.fromEntries(initialKeys.map((key) => [key, "Off"])));
  const [startStates, setStartStates] = useState(Object.fromEntries(initialKeys.map((key) => [key, "Start"])));
  const [progressStates, setProgressStates] = useState(Object.fromEntries(initialKeys.map((key) => [key, 0])));
  const [fileName, setFileName] = useState("Import RDR file");
  const [intervals, setIntervals] = useState({}); // เก็บ interval แต่ละ key
  const [isRunning, setIsRunning] = useState(Object.fromEntries(initialKeys.map((key) => [key, false])));

  // ##############################API Call Functions###################################

  const shutdownServer = async (key) => {
    try {
      console.log(`🛑 Shutting down ${key}...`);
      await fetch("http://localhost:5000/shutdown", { method: "POST" });
    } catch (error) {
      console.error("❌ Error shutting down server:", error);
    }
  };

  const runCommand = async (key) => {
    if (isRunning[key]) return; // ✅ ป้องกันการรันซ้ำ
    try {
      setIsRunning((prev) => ({ ...prev, [key]: true }));
      setStartStates((prev) => ({ ...prev, [key]: "Stop" }));
      setProgressStates((prev) => ({ ...prev, [key]: 0 }));

      const response = await axios.post("http://localhost:5000/start-command", { boxType: key });

      console.log("✅ Command started:", response.data);

      // ✅ ตั้ง interval เพื่อตรวจสอบ progress
      const progressInterval = setInterval(async () => {
        try {
          const progressRes = await axios.get("http://localhost:5000/check-progress");
          const progress = progressRes.data[key] ?? 0;
          setProgressStates((prev) => ({ ...prev, [key]: progress }));

          if (progress >= 100) {
            clearInterval(progressInterval);
            setIntervals((prev) => ({ ...prev, [key]: null }));
            setIsRunning((prev) => ({ ...prev, [key]: false }));
            setProgressStates((prev) => ({ ...prev, [key]: 100 }));


            Swal.fire({
              title: "Processing Completed!!",
              text: `${key} Completed`,
              icon: "success",
              confirmButtonText: "Finish",
            }).then(() => {
              shutdownServer(key); // ✅ ปิด process ของกล่องที่เสร็จสิ้น
            });
          }
        } catch (error) {
          console.error("❌ Error checking progress:", error);
        }
      }, 1000);
      setIntervals((prev) => ({ ...prev, [key]: progressInterval }));
    } catch (error) {
      console.error("❌ Error starting command:", error);
    }
  };

  const toggleStartStop = (key) => {
    if (buttonStates[key] === "On") {
      setStartStates((prevState) => {
        const newState = prevState[key] === "Start" ? "Stop" : "Start";

        if (newState === "Stop") {
          if (isRunning[key]) return prevState; // ✅ ป้องกันการรันซ้ำ

          setIsRunning((prev) => ({ ...prev, [key]: true }));
          setProgressStates((prev) => ({ ...prev, [key]: 0 }));

          if (key === "Flood") {
            // ✅ ตั้งค่า isRunning ของ Flood ก่อน
            setIsRunning((prev) => ({ ...prev, ["Flood"]: true }));


            if (!isRunning["SDR"]) {
              runCommand("SDR");
            }
            runCommand("Flood")
          } else {
            runCommand(key, () => {
              shutdownServer(key); // ✅ ปิดเซิร์ฟเวอร์หลังจากกระบวนการเสร็จ
            });
          }
        } else {
          // ✅ หยุดรันโดยใช้ shutdownServer ทันทีเมื่อกด Stop
          shutdownServer(key);

          if (intervals[key]) {
            clearInterval(intervals[key]);
            setIntervals((prev) => ({ ...prev, [key]: null }));
          }

          setProgressStates((prev) => ({ ...prev, [key]: 0 }));
          setIsRunning((prev) => ({ ...prev, [key]: false }));
        }

        return { ...prevState, [key]: newState };
      });
    }
  }





  // #################################################################

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredKeys = initialKeys.filter((key) =>
    key.toLowerCase().includes(searchQuery)
  );

  <handleFileUpload />

  
  const toggleButton = (key) => {
    setButtonStates((prevState) => {
      const newState = prevState[key] === "Off" ? "On" : "Off";
      if (newState === "Off") {
        setStartStates((prevStartStates) => ({ ...prevStartStates, [key]: "Start" }));
      }
      return { ...prevState, [key]: newState };
    });
  };

  // #################################################################


  return (
    <div>
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
  );
}

export default SNPPV2;
