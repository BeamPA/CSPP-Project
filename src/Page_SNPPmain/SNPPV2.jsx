import { useState } from "react";
import Swal from "sweetalert2";
import icon from "../assets/arrow-up.png";
import axios from "axios";
import GridComponent from "./GridComponent";

function SNPP() {
  // ###########################State Management######################################
  const initialKeys = [
    "SDR", "EDR", "Flood Detection", "Surface Reflectance and Vegetation Index", "Active Fire", "ASCI EDR",
    "ACSPO SST", "CLAVRx Cloud Retrieval", "UW Hyperspectral Retrieval", "HEAP NUCAPS CrIS/ATMS IASI/AMSUA/MHS Retrieval",
    "MiRS Microwave Retrieval", "GCOMW-1 AMSR-2 GAASP", "IAPP", "Real-time Software Telemetry Processing System (RT-STPS)",
    "Sounder QuickLook (QL)", "Polar2Grid Reprojection", "S-NPP HYDRA2 Visualization and Analysis Toolkit"
  ];

  const [hoveredKey, setHoveredKey] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [buttonStates, setButtonStates] = useState(Object.fromEntries(initialKeys.map((key) => [key, "Off"])));
  const [startStates, setStartStates] = useState(Object.fromEntries(initialKeys.map((key) => [key, "Start"])));
  const [progressStates, setProgressStates] = useState(Object.fromEntries(initialKeys.map((key) => [key, 0])));
  const [fileName, setFileName] = useState("Import RDR file");
  const [intervals, setIntervals] = useState({}); // เก็บ interval แต่ละ key
  const [isRunning, setIsRunning] = useState(Object.fromEntries(initialKeys.map((key) => [key, false])));

  // ##############################API Call Functions###################################

  const runCommand = async (key) => {
    if (isRunning[key]) return; // ✅ ป้องกันการรันซ้ำ
    try {
      setIsRunning((prev) => ({ ...prev, [key]: true })); // ตั้งค่าว่ากำลังรันอยู่
      setStartStates((prev) => ({ ...prev, [key]: "Stop" }));
      setProgressStates((prev) => ({ ...prev, [key]: 0 })); // ✅ เริ่ม progress ที่ 0
      
      // ✅ ส่ง key ไปที่ backend เพื่อรันคำสั่งของกล่องที่ถูกต้อง
      const response = await axios.post("http://localhost:5000/start-command", { boxType: key });

      console.log("✅ Command started:", response.data);
    } catch (error) {
      console.error("❌ Error starting command:", error);
    }
  };

  const shutdownServer = async (key) => {
    try {
      console.log(`🛑 Shutting down ${key}...`);
      await fetch("http://localhost:5000/shutdown", { method: "POST" });
    } catch (error) {
      console.error("❌ Error shutting down server:", error);
    }
  };

  const toggleStartStop = (key) => {
    if (buttonStates[key] === "On") 
    {
      setStartStates((prevState) => {
        const newState = prevState[key] === "Start" ? "Stop" : "Start";

        if (newState === "Stop") {
          // ✅ ตรวจสอบว่ากล่องนี้กำลังรันอยู่หรือไม่
          if (isRunning[key]) return prevState; // ถ้ากำลังรันคำสั่งอยู่แล้ว ไม่ให้รันคำสั่งซ้ำ

          // ✅ ตั้งค่า isRunning เป็น true เพื่อป้องกันการรันคำสั่งซ้ำ
          setIsRunning((prev) => ({ ...prev, [key]: true }));
          setProgressStates((prev) => ({ ...prev, [key]: 0 })); // 🔹 ตั้งค่า progress เริ่มต้นเป็น 0
          runCommand(key); // ✅ เรียกรันคำสั่งของกล่องที่เลือก

          // ✅ ตรวจสอบ progress ทุก ๆ 1 วินาที
          const interval = setInterval(async () => {
            try {
              const progressRes = await axios.get("http://localhost:5000/check-progress");
              const progress = progressRes.data[key]?.progress ?? 0; // ใช้ ?? เพื่อตั้งค่า default เป็น 0 หาก undefined

              setProgressStates((prev) => ({ ...prev, [key]: progress }));// 🔹 อัปเดต progress

              if (progress >= 100) {
                clearInterval(interval);
                setIsRunning((prev) => ({ ...prev, [key]: false })); // ✅ ตั้งค่าให้หยุดรัน

                Swal.fire({
                  title: "สำเร็จ!",
                  text: `${key} ทำงานเสร็จสิ้นแล้ว`,
                  icon: "success",
                  confirmButtonText: "ตกลง",
                }).then(() => {
                  shutdownServer(key); // ✅ ปิดเฉพาะ process ของกล่องนี้
                }).then(() => {
                  // 🔴 เรียก shutdownServer เมื่อทำงานเสร็จ (ปิดเซิร์ฟเวอร์)
                  shutdownServer();
                });
              }
            } catch (error) {
              console.error("❌ Error checking progress:", error);
            }
          }, 1000);

          setIntervals((prev) => ({ ...prev, [key]: interval })); // ✅ เก็บ interval ใน state
        } else {
          setProgressStates((prev) => ({ ...prev, [key]: 0 }));

          // ✅ เคลียร์ interval ก่อน shutdown
          if (intervals[key]) {
            clearInterval(intervals[key]);
          }

          // ✅ ตั้งค่า isRunning เป็น false เมื่อผู้ใช้กด Stop
          setIsRunning((prev) => ({ ...prev, [key]: false }));

          // ✅ ปิด process ของกล่องที่ผู้ใช้กด Stop
          shutdownServer(key);
        }

        return { ...prevState, [key]: newState };
      });
    }
  };


  // #################################################################

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredKeys = initialKeys.filter((key) =>
    key.toLowerCase().includes(searchQuery)
  );


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

export default SNPP;
