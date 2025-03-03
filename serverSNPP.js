import "dotenv/config"; // โหลดตัวแปรจาก .env
import express from "express";
import { Client } from "ssh2";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";
import mysql from "mysql2"; // เชื่อมต่อ MySQL
import sharp from "sharp";
import path from "path";
import multer from "multer";
import { exec } from "child_process";
import { fileURLToPath } from "url";
import { dirname } from "path";


// กำหนด __dirname ใน ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// กำหนดค่าการเชื่อมต่อ MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL Connection Error:", err);
    process.exit(1); // ถ้าเชื่อมต่อไม่ได้ ให้หยุดการทำงานของแอป
  }
  console.log("✅ MySQL Connected!");
});

// กำหนดค่าการเชื่อมต่อ SSH
const sshConfig = {
  host: process.env.SSH_HOST,
  port: process.env.SSH_PORT || 22,
  username: process.env.SSH_USER,
  password: process.env.SSH_PASSWORD,
};

// กำหนดค่าเซิร์ฟเวอร์และพาธปลายทาง
const serverIP = process.env.SSH_HOST || "103.156.150.73";
const remotePath = "/home/jpss/pepsi4.1/importdata";
// const privateKeyPath = process.env.PRIVATE_KEY_PATH || "/home/jpss/.ssh/id_rsa"; // ควรใช้ .env
const username = process.env.SSH_USER || "jpss";
const privateKeyPath = process.env.SSH_PASSWORD;



//#########################################################################################################################################################################



// ตั้งค่า multer สำหรับรับไฟล์
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// อัปโหลดไฟล์ไปยัง Backend
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.json({ success: false, message: "Uploaded file not found" });
  }

  const filePath = path.join(__dirname, "uploads", req.file.filename);
  console.log(`📂 ไฟล์ถูกอัปโหลดที่: ${filePath}`);

  const scpCommand = `scp ${filePath} ${username}@${serverIP}:${remotePath}`;

  exec(scpCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ ส่งไฟล์ล้มเหลว: ${stderr}`);
      return res.json({ success: false, message: "Failed to send file to server." });
    }
    console.log(`✅ ไฟล์ถูกส่งไปที่ ${serverIP}:${remotePath}`);
    res.json({ success: true, message: "File upload successful!" });
  });
});


// สถานะการทำงานของแต่ละกล่อง
let isRunning = {
  SDR: false,
  EDR: false,
  Flood: false,
  SurfaceReflectance: false,
};

// เก็บสถานะการรันของแต่ละ task
const runningTasks = {};
const progressStates = {};

// 📌 API สำหรับรันคำสั่ง SSH
app.post("/start-command", (req, res) => {
  const { boxType } = req.body;
  if (!boxType) return res.status(400).json({ error: "Missing 'boxType' in request body" });
  if (runningTasks[boxType]) return res.status(400).json({ error: `${boxType} is already running` });

  runningTasks[boxType] = true;
  progressStates[boxType] = 0;
  isRunning[boxType] = true;

  let command = "";
  switch (boxType) {
    // case "SDR":
    //   command = `
    //     cd pepsi4.1/CSPP/SDR_4_1/bin &&
    //     export CSPP_SDR_HOME=/home/jpss/pepsi4.1/CSPP/SDR_4_1 &&
    //     ./cspp_sdr_runtime.sh &&
    //     ./sdr_luts.sh &&
    //     ./sdr_ancillary.sh &&
    //     ./viirs_sdr.sh /home/jpss/pepsi4.1/rawdata/RNSCA-RVIRS_j01_d20250114_t0711288_e0724169_b00001_c20250114073423860000_drlu_ops.h5
    //   `; 
    //   break;
    case "Flood":
      command = "cd /home/jpss/suphattra && chmod +x run_flood2.sh && ./run_flood2.sh";
      break;
    default:
      return res.status(400).json({ error: "Invalid box type" });
  }



  // สร้าง SSH connection
  const conn = new Client();




  conn.on("ready", () => {
    console.log(`✅ SSH Connection Established for ${boxType}`);


    conn.exec(command, (err, stream) => {
      if (err) {
        console.error("❌ Error starting shell:", err);
        conn.end();
        isRunning[boxType] = false;
        delete runningTasks[boxType];
        if (!res.headersSent) {
          return res.status(500).json({ error: "Shell initialization failed" });
        }
        return; // ✅ ป้องกันไม่ให้ส่ง response ซ้ำ
      }

      // เริ่มสตรีม output
      let output = "";
      let detectedComplete = false;

      // ตั้ง Interval ให้เพิ่ม progress
      const interval = setInterval(() => {
        if (progressStates[boxType] < 95) {
          progressStates[boxType] += 5;
        }
      }, 1000);

      stream.on("data", (data) => {
        const message = data.toString();
        console.log("📡 OUTPUT:", message);
        output += message;
        // 📌 ตรวจจับข้อความที่บ่งบอกว่า process เสร็จสิ้น
        if (message.includes("Data inserted successfully") || message.includes(".tif")) {
          detectedComplete = true;
          progressStates[boxType] = 100;
          clearInterval(interval); // ❌ หยุด interval ไม่ให้เพิ่ม progress อีก
        }
      });

      stream.on("close", async () => {
        clearInterval(interval); // หยุดเพิ่ม progress
        console.log(`🔴 SSH Connection Closed for ${boxType}`);
        conn.end();

        progressStates[boxType] = 100;
        isRunning[boxType] = false; // รีเซ็ตสถานะเมื่อรันเสร็จ
        delete runningTasks[boxType];

        
        if (!res.headersSent) {
          res.json({ output, progress: 100, status: "Completed" });
        }





        // ค้นหาเฉพาะไฟล์ .tif จากเอาต์พุต
        const tifFilePattern = /([a-zA-Z0-9_\-]+\.tif)/;  // หาชื่อไฟล์ .tif
        const tifFileMatch = output.match(tifFilePattern);
        const tifFile = tifFileMatch ? tifFileMatch[0] : null;
        const nameSoftware = boxType; // หรือกำหนดให้รับค่าจาก process ที่รัน
        // if (tifFileMatch) {
        //   const tifFile = tifFileMatch[0];  // เก็บชื่อไฟล์ .tif
        //   const processStatus = 1; // 1 = Complete
        //   const saveStatus = 1; // 1 = Saved
        const processStatus = tifFile ? 1 : 2;
        const saveStatus = tifFile ? 1 : 2;

        if (tifFile) {
          // บันทึกไฟล์ .tif ลงในฐานข้อมูล
          db.query("INSERT INTO snpp (filename,date, name_software, process_status, save_status) VALUES (?, CURDATE(), ?, ?, ?) ON DUPLICATE KEY UPDATE process_status = VALUES(process_status), save_status = VALUES(save_status)",
            [tifFile, nameSoftware, processStatus, saveStatus], (err, result) => {
              if (err) {
                console.error('❌ Error inserting data into database:', err);
                return res.status(500).json({ error: 'Database error' });
              }

              console.log(`✅ Data inserted successfully: ${tifFile || "No TIF file"}`);

              // ส่งคำตอบให้กับ client
              return res.json({
                message: 'Process complete',
                tif_file: tifFile,
                process_status: processStatus,
                save_status: saveStatus
              });
            });
        } else {
          console.warn("⚠️ No TIF file found.");
          return res.json({
            message: "No TIF file found",
            process_status: processStatus,
            save_status: saveStatus
          });
        }
        // รันคำสั่ง
        console.log("🚀 Running Command:", command);
        stream.write(command + "\n");
      });
    });
  });






  conn.on("error", (err) => {
    console.error(`❌ SSH Connection Error for ${boxType}:`, err);
    isRunning[boxType] = false;
    delete runningTasks[boxType];
    res.status(500).json({ error: "SSH Connection Failed" });

  });

  conn.connect(sshConfig);

  res.json({ message: `Started ${boxType}`, progress: progressStates[boxType] });
});

// 📌 API ตรวจสอบ progress
app.get("/check-progress", (req, res) => {
  res.json(progressStates);
});

// 📌 API สำหรับหยุดเซิร์ฟเวอร์
app.post("/shutdown", (req, res) => {
  console.log("🛑 Server is shutting down...");
  res.json({ message: "Server shutting down..." });
  process.exit(0);
});

// 📌 เริ่มเซิร์ฟเวอร์
app.listen(5000, () => console.log("🚀 Server running on port 5000"));












// import 'dotenv/config';
// import express from "express";
// import { Client } from "ssh2";
// import cors from "cors";
// import bodyParser from "body-parser";
// import fs from 'fs';
// import mysql from 'mysql2';
// import sharp from 'sharp';
// import path from 'path';
// import multer from 'multer';


// const app = express();
// app.use(cors());
// app.use(bodyParser.json());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // กำหนดค่าการเชื่อมต่อ MySQL
// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });

// db.connect((err) => {
//   if (err) {
//     console.error("❌ MySQL Connection Error:", err);
//     process.exit(1); // ถ้าเชื่อมต่อไม่ได้ ให้หยุดการทำงานของแอป
//   }
//   console.log("✅ MySQL Connected!");
// });

// // กำหนดค่าการเชื่อมต่อ SSH
// const sshConfig = {
//   host: process.env.SSH_HOST,
//   port: process.env.SSH_PORT || 22,
//   username: process.env.SSH_USER,
//   password: process.env.SSH_PASSWORD,
// };

// // เก็บสถานะการรันของแต่ละ task
// const runningTasks = {};
// const progressStates = {};




// // กำหนดค่าเซิร์ฟเวอร์และพาธปลายทาง
// const serverIP = process.env.SSH_HOST || "103.156.150.73";
// const remotePath = "/home/jpss/pepsi4.1/importdata";
// // const privateKeyPath = process.env.PRIVATE_KEY_PATH || "/home/jpss/.ssh/id_rsa"; // ควรใช้ .env
// const username = process.env.SSH_USER || "jpss";
// const privateKeyPath = process.env.SSH_PASSWORD ;

// // ตั้งค่า multer สำหรับรับไฟล์
// const storage = multer.diskStorage({
//   destination: "uploads/",
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });
// const upload = multer({ storage });

// // อัปโหลดไฟล์ไปยัง Backend
// app.post("/upload", upload.single("file"), (req, res) => {
//   if (!req.file) {
//     return res.json({ success: false, message: "ไม่พบไฟล์ที่อัปโหลด" });
//   }

//   const filePath = path.join("C:\\Users\\supha\\CSPP-Project\\uploads", req.file.filename);
//   console.log(`📂 ไฟล์ถูกอัปโหลดที่: ${filePath}`);

//   const scpCommand = `scp -i ${privateKeyPath} ${filePath} ${username}@${serverIP}:${remotePath}`;
 
//   exec(scpCommand, (error, stdout, stderr) => {
//     if (error) {
//       console.error(`❌ ส่งไฟล์ล้มเหลว: ${stderr}`);
//       return res.json({ success: false, message: "ส่งไฟล์ไปยังเซิร์ฟเวอร์ไม่สำเร็จ" });
//     }
//     console.log(`✅ ไฟล์ถูกส่งไปที่ ${serverIP}:${remotePath}`);
//     res.json({ success: true, message: "อัปโหลดและส่งไฟล์สำเร็จ!" });
//   });
// });



// // 📌 API สำหรับรันคำสั่ง SSH
// app.post("/start-command", (req, res) => {
//   const { boxType } = req.body;
//   if (!boxType) return res.status(400).json({ error: "Missing 'boxType' in request body" });
//   if (runningTasks[boxType]) return res.status(400).json({ error: `${boxType} is already running` });

//   let command = "";
//   switch (boxType) {
//     case "Flood Detection":
//       command = "cd /home/jpss/suphattra && chmod +x run_flood2.sh && ./run_flood2.sh";
//       break;
//     default:
//       return res.status(400).json({ error: "Invalid box type" });
//   }

//   // สร้าง SSH connection
//   const conn = new Client();
//   runningTasks[boxType] = true;
//   progressStates[boxType] = 0;




//   conn.on("ready", () => {
//     console.log(`✅ SSH Connection Established for ${boxType}`);


//     conn.exec(command, (err, stream) => {
//       if (err) {
//         console.error("❌ Error starting shell:", err);
//         conn.end();
//         delete runningTasks[boxType];
//         if (!res.headersSent) {
//           return res.status(500).json({ error: "Shell initialization failed" });
//         }
//         return; // ป้องกันไม่ให้ส่งคำตอบอีกครั้ง
//       }

//       // เริ่มสตรีม output
//       let output = "";
//       stream.on("data", (data) => {
//         const message = data.toString();
//         console.log("📡 OUTPUT:", message);
//         output += message;
//       });

//       stream.on("close", () => {
//         console.log(`🔴 SSH Connection Closed for ${boxType}`);
//         conn.end();
//         progressStates[boxType] = 100;
//         delete runningTasks[boxType];





//         // ค้นหาเฉพาะไฟล์ .tif จากเอาต์พุต
//         const tifFilePattern = /([a-zA-Z0-9_\-]+\.tif)/;  // หาชื่อไฟล์ .tif
//         const tifFileMatch = output.match(tifFilePattern);

//         if (tifFileMatch) {
//           const tifFile = tifFileMatch[0];  // เก็บชื่อไฟล์ .tif

//           // บันทึกไฟล์ .tif ลงในฐานข้อมูล
//           db.query("INSERT INTO snpp (filename) VALUES (?)", [tifFile], (err, result) => {
//             if (err) {
//               console.error('❌ Error inserting data into database:', err);
//               return res.status(500).json({ error: 'Database error' });
//             }

//             console.log(`✅ Data stored in database with ID: ${result.insertId}`);

//             // ส่งคำตอบให้กับ client
//             return res.json({ message: 'Process complete', progress: 100, id: result.insertId, tif_file: tifFile });
//           });
//         } else {
//           return res.status(500).json({ error: 'No .tif file generated' });
//         }
//       });
//       // รันคำสั่ง
//       console.log("🚀 Running Command:", command);
//       stream.write(command + "\n");
//     });
//   });






//   conn.on("error", (err) => {
//     console.error(`❌ SSH Connection Error for ${boxType}:`, err);
//     delete runningTasks[boxType];
//   });

//   conn.connect(sshConfig);

//   res.json({ message: `Started ${boxType}`, progress: progressStates[boxType] });
// });

// // 📌 API ตรวจสอบ progress
// app.get("/check-progress", (req, res) => {
//   res.json(progressStates);
// });

// // 📌 API สำหรับหยุดเซิร์ฟเวอร์
// app.post("/shutdown", (req, res) => {
//   console.log("🛑 Server is shutting down...");
//   res.json({ message: "Server shutting down..." });
//   process.exit(0);
// });

// // 📌 เริ่มเซิร์ฟเวอร์
// app.listen(3000, () => console.log("🚀 Server running on port 3000"));





