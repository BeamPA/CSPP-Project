
function BoxComponent({
    label,
    isInteractive = false,
    hoveredKey,
    setHoveredKey,
    buttonStates,
    startStates,
    progressStates,
    toggleButton,
    toggleStartStop,
    runCommand,}) {
    return (
      <div
        className={`relative flex-shrink-0 w-[160px] h-[151px] rounded-2xl ${
          isInteractive && hoveredKey === label ? "border-4 border-yellow-400" : "border-transparent"
        }`}
        onMouseEnter={isInteractive ? () => setHoveredKey(label) : undefined}
        onMouseLeave={isInteractive ? () => setHoveredKey(null) : undefined}
      >
  
  
        <div className="absolute inset-0 bg-white rounded-2xl z-10"></div>
        <div className={`absolute top-3 left-4 w-[125px] h-[120px] rounded-2xl z-20 flex flex-col items-center justify-center text-center ${
          isInteractive ? (buttonStates[label] === "Off" ? "bg-black text-white" : "bg-[#D9D9D9] text-black") : "bg-[#D9D9D9] text-black"
        }`}>
  
  
          <span className="text-sm w-full whitespace-normal break-words mb-10">{label}</span>
  
  
          {isInteractive && (
            <div className="absolute bottom-2 flex justify-between w-full px-2">
  
  
              <button
                className={`w-[48px] h-[33px] rounded-2xl z-30 text-black ${
                  buttonStates[label] === "Off" ? "bg-[#D14013]" : "bg-[#2ECC71]"
                }`}
                onClick={() => toggleButton && toggleButton(label)}
  
              >
                {buttonStates[label]}
              </button>
  
  
  
              <button
                className={`w-[48px] h-[33px] rounded-2xl z-30 text-black ${
                  buttonStates[label] === "Off"
                    ? "bg-[#9BA19C] cursor-not-allowed"
                    : startStates[label] === "Start"
                    ? "bg-[#2ECC71]"
                    : "bg-[#FED803]"
                }`}
                onClick={() => {
                  toggleStartStop(label);
                  if (label === "Flood Detection") runCommand();
                }}
                disabled={buttonStates[label] === "Off"}
              >
                {startStates[label]}
              </button>
  
  
  
            </div>
          )}
  
  
          {/*เงื่อนไขการแสดง Progress Bar */}
          {isInteractive && startStates[label] === "Stop" && (
            <div className="absolute bottom-[-20px] w-full px-1 flex items-center">
  
              {/* Progress Bar หลัก */}
  
              <div className="w-full h-[4px] bg-gray-300 rounded">
  
              {/* แสดงความคืบหน้าของ progress ตามค่า progressStates[label] */}
              {/* ถ้าไม่มีค่า (undefined หรือ null) จะใช้ค่า 0% */}
  
                <div className="h-full bg-green-500 rounded" 
                style={{ width: `${progressStates?.[label] ?? 0}%` }}></div>
              </div>
              
              {/* แสดงค่าเปอร์เซ็นต์ */}
  
              <span className="text-sm text-black font-bold ml-2">
                {progressStates[label]}%
              </span>
            </div>
          )}
  
  
  
        </div>
      </div>
    );
  };
  export default BoxComponent;