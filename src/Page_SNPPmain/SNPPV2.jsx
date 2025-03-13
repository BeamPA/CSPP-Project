// import { useState, useEffect } from "react";
// import Swal from "sweetalert2";
// import icon from "../assets/arrow-up.png";
// import axios from "axios";
// import GridComponent from "./GridComponent";
// import handleFileUpload from "./handleFileUpload";

// function SNPPV2() {
//   const [keys, setKeys] = useState([]);
//   const [hoveredKey, setHoveredKey] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [buttonStates, setButtonStates] = useState({});
//   const [startStates, setStartStates] = useState({});
//   const [progressStates, setProgressStates] = useState({});
//   const [fileName, setFileName] = useState("Import RDR file");
//   const [intervals, setIntervals] = useState({});
//   const [isRunning, setIsRunning] = useState({});

//   // Fetch keys from API on component mount
//   useEffect(() => {
//     const fetchKeys = async () => {
//       try {
//         const response = await axios.get("http://localhost:3000/software/software-list");
//         console.log("API Response:", response.data); // Log การตอบกลับจาก API
//         const softwareList = response.data.softwareList; // ดึงข้อมูล softwareList
//         setKeys(softwareList);
  
//         // ตั้งค่า states ตาม list ของ software
//         setButtonStates(Object.fromEntries(softwareList.map((key) => [key, "Off"])));
//         setStartStates(Object.fromEntries(softwareList.map((key) => [key, "Start"])));
//         setProgressStates(Object.fromEntries(softwareList.map((key) => [key, 0])));
//         setIsRunning(Object.fromEntries(softwareList.map((key) => [key, false])));
//       } catch (error) {
//         console.error("❌ Error fetching software list:", error);
//       }
//     };
  
//     fetchKeys();
//   }, []);
  

//   // ##############################API Call Functions###################################

//   const shutdownServer = async (key) => {
//     try {
//       console.log(`🛑 Shutting down ${key}...`);
//       await fetch("http://localhost:3000/shutdown", { method: "POST" });
//     } catch (error) {
//       console.error("❌ Error shutting down server:", error);
//     }
//   };

//   const runCommand = async (key) => {
//     if (isRunning[key]) return;
//     try {
//       setIsRunning((prev) => ({ ...prev, [key]: true }));
//       setStartStates((prev) => ({ ...prev, [key]: "Stop" }));
//       setProgressStates((prev) => ({ ...prev, [key]: 0 }));

//       const response = await axios.post("http://localhost:3000/start-command", { boxType: key });

//       console.log("✅ Command started:", response.data);

//       const progressInterval = setInterval(async () => {
//         try {
//           const progressRes = await axios.get("http://localhost:3000/check-progress");
//           const progress = progressRes.data[key] ?? 0;
//           setProgressStates((prev) => ({ ...prev, [key]: progress }));

//           if (progress >= 100) {
//             clearInterval(progressInterval);
//             setIntervals((prev) => ({ ...prev, [key]: null }));
//             setIsRunning((prev) => ({ ...prev, [key]: false }));
//             setProgressStates((prev) => ({ ...prev, [key]: 100 }));

//             Swal.fire({
//               title: "Processing Completed!!",
//               text: `${key} Completed`,
//               icon: "success",
//               confirmButtonText: "Finish",
//             }).then(() => {
//               shutdownServer(key);
//             });
//           }
//         } catch (error) {
//           console.error("❌ Error checking progress:", error);
//         }
//       }, 1000);
//       setIntervals((prev) => ({ ...prev, [key]: progressInterval }));
//     } catch (error) {
//       console.error("❌ Error starting command:", error);
//     }
//   };

//   const toggleStartStop = (key) => {
//     if (buttonStates[key] === "On") {
//       setStartStates((prevState) => {
//         const newState = prevState[key] === "Start" ? "Stop" : "Start";

//         if (newState === "Stop") {
//           if (isRunning[key]) return prevState;

//           setIsRunning((prev) => ({ ...prev, [key]: true }));
//           setProgressStates((prev) => ({ ...prev, [key]: 0 }));

//           if (key === "Flood") {
//             setIsRunning((prev) => ({ ...prev, ["Flood"]: true }));

//             if (!isRunning["SDR"]) {
//               runCommand("SDR");
//             }
//             runCommand("Flood");
//           } else {
//             runCommand(key);
//           }
//         } else {
//           shutdownServer(key);

//           if (intervals[key]) {
//             clearInterval(intervals[key]);
//             setIntervals((prev) => ({ ...prev, [key]: null }));
//           }

//           setProgressStates((prev) => ({ ...prev, [key]: 0 }));
//           setIsRunning((prev) => ({ ...prev, [key]: false }));
//         }

//         return { ...prevState, [key]: newState };
//       });
//     }
//   };

//   // #################################################################

//   const handleSearch = (e) => {
//     setSearchQuery(e.target.value.toLowerCase());
//   };

//   const filteredKeys = keys.filter((key) =>
//     key.toLowerCase().includes(searchQuery)
//   );

//   <handleFileUpload />;

//   const toggleButton = (key) => {
//     setButtonStates((prevState) => {
//       const newState = prevState[key] === "Off" ? "On" : "Off";
//       if (newState === "Off") {
//         setStartStates((prevStartStates) => ({ ...prevStartStates, [key]: "Start" }));
//       }
//       return { ...prevState, [key]: newState };
//     });
//   };

//   return (
//     <div>
//       {/* Search Box */}
//       <input
//         type="text"
//         placeholder="Search"
//         className="w-full p-2 border border-gray-300 rounded-2xl mb-6"
//         onChange={handleSearch}
//       />

//       {/* File Upload Box */}
//       <div className="mb-4">
//         <label
//           htmlFor="file-upload"
//           className="flex justify-between w-full items-center p-2 border border-gray-300 rounded-2xl cursor-pointer bg-white"
//         >
//           <span className="text-gray-700">{fileName}</span>
//           <input
//             id="file-upload"
//             type="file"
//             className="hidden"
//             accept=".h5"
//             onChange={handleFileUpload}
//           />
//           <img src={icon} alt="icon" className="w-6" />
//         </label>
//       </div>

//       {/* Grid Component */}
//       <GridComponent
//         filteredKeys={filteredKeys}
//         buttonStates={buttonStates}
//         startStates={startStates}
//         progressStates={progressStates}
//         toggleButton={toggleButton}
//         toggleStartStop={toggleStartStop}
//         runCommand={runCommand}
//         setHoveredKey={setHoveredKey}
//         hoveredKey={hoveredKey}
//       />
//     </div>
//   );
// }

// export default SNPPV2;


import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import icon from "../assets/arrow-up.png";
import axios from "axios";
import GridComponent from "./GridComponent";
import handleFileUpload from "./handleFileUpload";
function SNPPV2() {
 const [keys, setKeys] = useState([]);
 const [hoveredKey, setHoveredKey] = useState(null);
 const [searchQuery, setSearchQuery] = useState("");
 const [buttonStates, setButtonStates] = useState({});
 const [startStates, setStartStates] = useState({});
 const [progressStates, setProgressStates] = useState({});
 const [fileName, setFileName] = useState("Import RDR file");
 const [intervals, setIntervals] = useState({});
 const [isRunning, setIsRunning] = useState({});
 // Fetch keys from API on component mount
 useEffect(() => {
   const fetchKeys = async () => {
     try {
       const response = await axios.get("http://localhost:3000/software/software-list");
       console.log("API Response:", response.data); // Log การตอบกลับจาก API
       const softwareList = response.data.softwareList; // ดึงข้อมูล softwareList
       setKeys(softwareList);
       // ตั้งค่า states ตาม list ของ software
       setButtonStates(Object.fromEntries(softwareList.map((key) => [key, "Off"])));
       setStartStates(Object.fromEntries(softwareList.map((key) => [key, "Start"])));
       setProgressStates(Object.fromEntries(softwareList.map((key) => [key, 0])));
       setIsRunning(Object.fromEntries(softwareList.map((key) => [key, false])));
     } catch (error) {
       console.error("❌ Error fetching software list:", error);
     }
   };
   fetchKeys();
 }, []);

 // ##############################API Call Functions###################################
 const shutdownServer = async (key) => {
   try {
     console.log(`🛑 Shutting down ${key}...`);
     await fetch("http://localhost:3000/shutdown", { method: "POST" });
   } catch (error) {
     console.error("❌ Error shutting down server:", error);
   }
 };
 const runCommand = async (key) => {
   if (isRunning[key]) return;
   try {
     setIsRunning((prev) => ({ ...prev, [key]: true }));
     setStartStates((prev) => ({ ...prev, [key]: "Stop" }));
     setProgressStates((prev) => ({ ...prev, [key]: 0 }));
     const response = await axios.post("http://localhost:3000/start-command", { boxType: key });
     console.log("✅ Command started:", response.data);
     const progressInterval = setInterval(async () => {
       try {
         const progressRes = await axios.get("http://localhost:3000/check-progress");
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
             shutdownServer(key);
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
         if (isRunning[key]) return prevState;
         setIsRunning((prev) => ({ ...prev, [key]: true }));
         setProgressStates((prev) => ({ ...prev, [key]: 0 }));
         if (key === "Flood") {
           setIsRunning((prev) => ({ ...prev, ["Flood"]: true }));
           if (!isRunning["SDR"]) {
             runCommand("SDR");
           }
           runCommand("Flood");
         } else {
           runCommand(key);
         }
       } else {
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
 };
 // #################################################################
 const handleSearch = (e) => {
   setSearchQuery(e.target.value.toLowerCase());
 };
 const filteredKeys = keys.filter((key) =>
   key.toLowerCase().includes(searchQuery)
 );
 // ฟังก์ชันที่ใช้สำหรับจัดการไฟล์ที่เลือก
 const handleFileChange = (e) => {
   const file = e.target.files[0];
   if (file) {
     setFileName(file.name); // อัปเดตชื่อไฟล์เมื่อเลือกไฟล์
   }
 };

<handleFileUpload />;
 const toggleButton = (key) => {
   setButtonStates((prevState) => {
     const newState = prevState[key] === "Off" ? "On" : "Off";
     if (newState === "Off") {
       setStartStates((prevStartStates) => ({ ...prevStartStates, [key]: "Start" }));
     }
     return { ...prevState, [key]: newState };
   });
 };
 return (
<div>
     {/* Search Box */}
<input
       type="text"
       placeholder="Search"
       className="w-full p-2 border border-gray-300 rounded-2xl mb-6"
       onChange={handleSearch}
     />
     {/* File Upload Box */}
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
           onChange={(e) => { handleFileUpload(e); handleFileChange(e); }}
         />
<img src={icon} alt="icon" className="w-6" />
</label>
</div>
     {/* Grid Component */}
<GridComponent
       filteredKeys={keys}
       buttonStates={buttonStates}
       startStates={startStates}
       progressStates={progressStates}
       toggleButton={toggleButton}
       toggleStartStop={toggleStartStop}
       runCommand={runCommand}
       setHoveredKey={setHoveredKey}
       hoveredKey={hoveredKey}
       searchQuery={searchQuery} // ส่ง searchQuery ไปยัง GridComponent
     />
</div>
 );
}
export default SNPPV2;