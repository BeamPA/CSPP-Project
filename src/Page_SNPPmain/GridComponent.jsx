import BoxComponent from "./BoxComponent";

function GridComponent({
  filteredKeys,
  buttonStates,
  startStates,
  progressStates,
  hoveredKey,
  setHoveredKey,
  toggleButton,
  toggleStartStop,
  runCommand
}) {
  return (
    <div className="w-full h-auto overflow-hidden border border-gray-300 p-4 rounded-lg mt-4">
      {filteredKeys.length === 0 ? (
        <p className="text-center text-gray-500">ไม่พบข้อมูล</p>
      ) : (
        <div className="grid grid-rows-3 gap-4">
          {/* SDR */}
          <div className="flex gap-4">
            {filteredKeys.includes("SDR") && (
              <BoxComponent
                key="SDR"
                label="SDR"
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
            )}
          </div>

          {/* EDR */}
          <div className="flex gap-4">
            {filteredKeys.includes("EDR") && (
              <BoxComponent
                key="EDR"
                label="EDR"
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
            )}
          </div>

          {/* ที่เหลือทั้งหมด */}
          <div className="w-full h-full overflow-x-auto">
            <div className="grid grid-flow-col gap-4">
              {filteredKeys
                .filter((key) => key !== "SDR" && key !== "EDR")
                .map((key) => (
                  <BoxComponent
                    key={key} //แยกแต่ละกล่อง
                    label={key} //กำหนดชื่อกล่อง
                    isInteractive //กล่องโต้ตอบได้
                    hoveredKey={hoveredKey} //จัดการhover
                    setHoveredKey={setHoveredKey} //จัดการhover
                    buttonStates={buttonStates} //การควบคุมสถานะของปุ่ม
                    startStates={startStates} //การควบคุมสถานะของปุ่ม
                    progressStates={progressStates} //การควบคุมสถานะของปุ่ม
                    toggleButton={toggleButton} //ควบคุมพฤติกรรมของปุ่ม
                    toggleStartStop={toggleStartStop} //ควบคุมพฤติกรรมของปุ่ม
                    runCommand={runCommand} //ควบคุมพฤติกรรมของปุ่ม
                  />
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GridComponent;