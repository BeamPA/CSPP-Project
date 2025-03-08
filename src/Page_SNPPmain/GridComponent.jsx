import { useEffect, useState } from "react";
import BoxComponent from "./BoxComponent";

function GridComponent({
  buttonStates,
  startStates,
  progressStates,
  hoveredKey,
  setHoveredKey,
  toggleButton,
  toggleStartStop,
  runCommand
}) {
  const [levelGroupedSoftware, setLevelGroupedSoftware] = useState({
    level1: [],
    level2: [],
    level3: []
  });

  // Fetch software status and group them by level
  const fetchSoftwareStatus = async () => {
    try {
      console.log("📡 Fetching all software statuses...");
      const response = await fetch("http://localhost:3000/software/software-list");

      if (!response.ok) throw new Error("❌ Failed to fetch software list");

      const { softwareList } = await response.json();
      console.log("✅ Software List:", softwareList);

      // Fetch individual software statuses
      const statusPromises = softwareList.map(async (name) => {
        const res = await fetch(`http://localhost:3000/software/check-software-status?name_software=${name}`);
        const data = await res.json();
        return { name, status: data.status === 1, level: data.level }; // Include level as well
      });

      const statusResults = await Promise.all(statusPromises);
      console.log("✅ Software Status:", statusResults);

      // Group by levels
      const groupedByLevel = {
        level1: [],
        level2: [],
        level3: [],
      };

      statusResults.forEach(({ name, status, level }) => {
        if (status) { // Only add active software
          if (level === 1) {
            groupedByLevel.level1.push(name);
          } else if (level === 2) {
            groupedByLevel.level2.push(name);
          } else if (level === 3) {
            groupedByLevel.level3.push(name);
          }
        }
      });

      setLevelGroupedSoftware(groupedByLevel);
    } catch (error) {
      console.error("🚨 Error fetching software status:", error);
    }
  };

  

  useEffect(() => {
    fetchSoftwareStatus();
  }, []);

  return (
    <div className="w-full h-auto overflow-hidden border border-gray-300 p-4 rounded-lg mt-4">
      {Object.keys(levelGroupedSoftware).length === 0 ? (
        <p className="text-center text-gray-500">ไม่พบข้อมูล</p>
      ) : (
        <div className="grid grid-rows-3 gap-4">
          {/* 🔹 Show boxes grouped by level */}
          {["level1", "level2", "level3"].map((levelKey, index) => (
            <div key={index} className="grid grid-flow-col gap-4">
              {levelGroupedSoftware[levelKey].map((key) => (
                <BoxComponent
                  key={key}
                  label={key} // Label for each software
                  isInteractive
                  hoveredKey={hoveredKey}
                  setHoveredKey={setHoveredKey}
                  buttonStates={buttonStates}
                  startStates={startStates}
                  progressStates={progressStates}
                  toggleButton={toggleButton}
                  toggleStartStop={toggleStartStop}
                  runCommand={runCommand}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GridComponent;

