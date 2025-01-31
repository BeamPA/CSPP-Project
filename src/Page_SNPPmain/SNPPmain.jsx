import { useState } from "react";
import Swal from "sweetalert2";
import icon from '../assets/arrow-up.png';

function SNPPmain() {
  const [fileName, setFileName] = useState("Import RDR file");
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
        e.target.value = ""; // รีเซ็ตค่า input
        setFileName("Import RDR file"); // รีเซ็ตชื่อไฟล์
        return;
      }
      setFileName(file.name);
    } else {
      setFileName("Import RDR file");
    }
  };

  const [hoveredKey, setHoveredKey] = useState(null); // ใช้สำหรับตรวจสอบว่าตัวไหนถูก hover
  
  // กำหนดสถานะของปุ่มแต่ละตัว
  const initialKeys = ["SDR", "EDR", "Land Surface Reflectance", "Flood Detection", "Active Fire", "ASCI EDR",
    "Surface Reflectance and Vegetation Index", "ACSPO SST", "CLAVRx Cloud Retrieval", "Infrared Sounder Retrieval",
    "UW Hyperspectral Retrieval", "HEAP NUCAPS CrIS/ATMS IASI/AMSUA/MHS Retrieval", "MiRS Microwave Retrieval",
    "GCOMW-1 AMSR-2 GAASP", "IAPP", "Real-time Software Telemetry Processing System (RT-STPS)", "Sounder QuickLook (QL)",
    "Polar2Grid Reprojection", "S-NPP HYDRA2 Visualization and Analysis Toolkit"];
  const [buttonStates, setButtonStates] = useState(
    Object.fromEntries(initialKeys.map((key) => [key, "Off"]))
  );
  const [startStates, setStartStates] = useState(
    Object.fromEntries(initialKeys.map((key) => [key, "Start"]))
  );
  const [progressStates, setProgressStates] = useState(
    Object.fromEntries(initialKeys.map((key) => [key, 0]))
  );

  // ฟังก์ชันสำหรับการสลับสถานะปุ่ม Off/On
  const toggleButton = (key) => {
    setButtonStates((prevState) => {
      const newState = prevState[key] === "Off" ? "On" : "Off";


      if (newState === "Off") {
        setStartStates((prevStartStates) => ({
          ...prevStartStates,
          [key]: "Start"
        }));
      }

      return { ...prevState, [key]: newState };
    });
  };

  // ฟังก์ชันกด Start/Stop
  const toggleStartStop = (key) => {
    if (buttonStates[key] === "On") {
      setStartStates((prevState) => {
        const newState = prevState[key] === "Start" ? "Stop" : "Start";

        if (newState === "Stop") {
          // เริ่มโหลดเมื่อกด Start
          let progress = 0;
          const interval = setInterval(() => {
            progress += 10;
            setProgressStates((prev) => ({ ...prev, [key]: progress }));

            if (progress >= 100) {
              clearInterval(interval);
              // Swal.fire({
              //   title: "Processing Completed!!",
              //   icon: "success",
              //   draggable: true,
              // });
            }
          }, 200);
        } else {
          // รีเซ็ตโหลดเมื่อกด Stop
          setProgressStates((prev) => ({ ...prev, [key]: 0 }));
        }

        return { ...prevState, [key]: newState };
      });
    }
  };



  return (
    <div>

      {/* Main Content */}
      <div>

        {/* กล่องSearch */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search"
            className="w-full p-2 border border-gray-300 rounded-2xl"
          />
        </div>

        {/* กล่องนำเข้า RDR file */}
        <div className="mb-6">
          <label
            htmlFor="file-upload"
            className="flex justify-between w-full items-center p-2 border border-gray-300 rounded-2xl cursor-pointer bg-white"
          >
            <span className="text-gray-700">{fileName}</span> {/* แสดงชื่อไฟล์ที่เลือก */}
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



        {/* Container สำหรับ Scroll เฉพาะส่วนนี้ */}
        <div className="w-full h-[520px] overflow-hidden border border-gray-300 p-4 rounded-lg mt-4">
          <div className="w-full h-full overflow-x-auto">
            <div className="flex flex-nowrap gap-4 grid grid-rows-3">



              <div className="flex flex-nowrap gap-4 overflow-x-auto">
                {/* ถ้าเพิ่มกล่องตรงนี้ต้องไปเพิ่มuseStateด้านบนด้วย */}
                {["SDR"].map((key) => (
                  <div
                    key={key}
                    className={`relative flex-shrink-0 w-[160px] h-[151px] rounded-2xl 
                    ${hoveredKey === key ? "border-4 border-yellow-400" : "border-transparent"}
                  `}
                    onMouseEnter={() => setHoveredKey(key)}
                    onMouseLeave={() => setHoveredKey(null)}
                  >

                    <div className="absolute inset-0 bg-white rounded-2xl z-10"></div>
                    <div
                      className={`absolute top-3 left-4 w-[125px] h-[120px] rounded-2xl z-20 flex flex-col items-center justify-center text-center relative 
        ${buttonStates[key] === "Off" ? "bg-black" : "bg-[#D9D9D9]"}`}
                    >
                      <span
                        className={`text-lg w-full whitespace-normal break-words mb-10
          ${buttonStates[key] === "Off" ? "text-white" : "text-black"}`}
                      >
                        {key}
                      </span>

                      <div className="absolute bottom-2 flex justify-between w-full px-2">
                        {/* ปุ่ม Off/On */}
                        <button
                          className={`w-[48px] h-[33px] rounded-2xl z-30 text-black 
            ${buttonStates[key] === "Off" ? "bg-[#D14013]" : "bg-[#2ECC71]"}`}
                          onClick={() => toggleButton(key)}
                        >
                          {buttonStates[key]}
                        </button>

                        {/* ปุ่ม Start/Stop */}
                        <button
                          className={`w-[48px] h-[33px] rounded-2xl z-30 text-black 
            ${buttonStates[key] === "Off" ? "bg-[#9BA19C] cursor-not-allowed" : (startStates[key] === "Start" ? "bg-[#2ECC71]" : "bg-[#FED803]")}`}
                          onClick={() => toggleStartStop(key)}
                          disabled={buttonStates[key] === "Off"}
                        >
                          {startStates[key]}
                        </button>
                      </div>
                      {/* แถบโหลด */}
                      {startStates[key] === "Stop" && (
                        <div className="absolute bottom-[-20px] w-full px-1 flex items-center">
                          <div className="w-full h-[4px] bg-gray-300 rounded">
                            <div
                              className="h-full bg-green-500 rounded"
                              style={{ width: `${progressStates[key]}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-black font-bold ml-2">{progressStates[key]}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>




              <div className="flex flex-nowrap gap-4 overflow-x-auto">
                {["EDR"].map((key) => (
                  <div
                    key={key}
                    className={`relative flex-shrink-0 w-[160px] h-[151px] rounded-2xl 
                    ${hoveredKey === key ? "border-4 border-yellow-400" : "border-transparent"}
                  `}
                    onMouseEnter={() => setHoveredKey(key)}
                    onMouseLeave={() => setHoveredKey(null)}
                  >

                    <div className="absolute inset-0 bg-white rounded-2xl z-10"></div>
                    <div
                      className={`absolute top-3 left-4 w-[125px] h-[120px] rounded-2xl z-20 flex flex-col items-center justify-center text-center relative 
        ${buttonStates[key] === "Off" ? "bg-black" : "bg-[#D9D9D9]"}`}
                    >
                      <span
                        className={`text-lg w-full whitespace-normal break-words mb-10
          ${buttonStates[key] === "Off" ? "text-white" : "text-black"}`}
                      >
                        {key}
                      </span>

                      <div className="absolute bottom-2 flex justify-between w-full px-2">
                        {/* ปุ่ม Off/On */}
                        <button
                          className={`w-[48px] h-[33px] rounded-2xl z-30 text-black 
            ${buttonStates[key] === "Off" ? "bg-[#D14013]" : "bg-[#2ECC71]"}`}
                          onClick={() => toggleButton(key)}
                        >
                          {buttonStates[key]}
                        </button>

                        {/* ปุ่ม Start/Stop */}
                        <button
                          className={`w-[48px] h-[33px] rounded-2xl z-30 text-black 
            ${buttonStates[key] === "Off" ? "bg-[#9BA19C] cursor-not-allowed" : (startStates[key] === "Start" ? "bg-[#2ECC71]" : "bg-[#FED803]")}`}
                          onClick={() => toggleStartStop(key)}
                          disabled={buttonStates[key] === "Off"}
                        >
                          {startStates[key]}
                        </button>
                      </div>
                      {/* แถบโหลด */}
                      {startStates[key] === "Stop" && (
                        <div className="absolute bottom-[-20px] w-full px-1 flex items-center">
                          <div className="w-full h-[4px] bg-gray-300 rounded">
                            <div
                              className="h-full bg-green-500 rounded"
                              style={{ width: `${progressStates[key]}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-black font-bold ml-2">{progressStates[key]}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>



              <div className="flex flex-nowrap gap-4 overflow-x-auto ">
                {["Land Surface Reflectance", "Flood Detection", "Active Fire", "ASCI EDR", "Surface Reflectance and Vegetation Index", "ACSPO SST", "CLAVRx Cloud Retrieval", "Infrared Sounder Retrieval",
                  "UW Hyperspectral Retrieval", "HEAP NUCAPS CrIS/ATMS IASI/AMSUA/MHS Retrieval", "MiRS Microwave Retrieval", "GCOMW-1 AMSR-2 GAASP", "IAPP", "Real-time Software Telemetry Processing System (RT-STPS)", "Sounder QuickLook (QL)",
                  "Polar2Grid Reprojection", "S-NPP HYDRA2 Visualization and Analysis Toolkit"].map((key) => (
                    <div
                      key={key}
                      className={`relative flex-shrink-0 w-[160px] h-[151px] rounded-2xl 
              ${hoveredKey === key ? "border-4 border-yellow-400" : "border-transparent"}
            `}
                      onMouseEnter={() => setHoveredKey(key)}
                      onMouseLeave={() => setHoveredKey(null)}
                    >
                      <div className="absolute inset-0 bg-white rounded-2xl z-10"></div>
                      <div
                        className={`absolute top-3 left-4 w-[125px] h-[120px] rounded-2xl z-20 flex flex-col items-center justify-center text-center relative 
        ${buttonStates[key] === "Off" ? "bg-black" : "bg-[#D9D9D9]"}`}
                      >
                        <span
                          className={`text-sm w-full whitespace-normal break-words mb-10
          ${buttonStates[key] === "Off" ? "text-white" : "text-black"}`}
                        >
                          {key}
                        </span>

                        <div className="absolute bottom-2 flex justify-between w-full px-2">
                          {/* ปุ่ม Off/On */}
                          <button
                            className={`w-[48px] h-[33px] rounded-2xl z-30 text-black 
            ${buttonStates[key] === "Off" ? "bg-[#D14013]" : "bg-[#2ECC71]"}`}
                            onClick={() => toggleButton(key)}
                          >
                            {buttonStates[key]}
                          </button>

                          {/* ปุ่ม Start/Stop */}
                          <button
                            className={`w-[48px] h-[33px] rounded-2xl z-30 text-black 
            ${buttonStates[key] === "Off" ? "bg-[#9BA19C] cursor-not-allowed" : (startStates[key] === "Start" ? "bg-[#2ECC71]" : "bg-[#FED803]")}`}
                            onClick={() => toggleStartStop(key)}
                            disabled={buttonStates[key] === "Off"}
                          >
                            {startStates[key]}
                          </button>
                        </div>
                        {/* แถบโหลด */}
                        {startStates[key] === "Stop" && (
                          <div className="absolute bottom-[-20px] w-full px-1 flex items-center">
                            <div className="w-full h-[4px] bg-gray-300 rounded">
                              <div
                                className="h-full bg-green-500 rounded"
                                style={{ width: `${progressStates[key]}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-black font-bold ml-2">{progressStates[key]}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SNPPmain;
