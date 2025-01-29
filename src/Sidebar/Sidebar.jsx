import React from "react";
import logo from "../assets/logo-gistda.png";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-[#0E3B61] p-4 flex flex-col rounded-box h-screen ml-[-12px]">
        {/* โลโก้อยู่ด้านบน */}
        <img src={logo} alt="Logo GISTDA" className="w-32 mx-auto mb-4" />

        <div className="tabs flex flex-col items-start mt-20">
          <hr className="w-full border-white mb-1" />
          <Link
            to="/SNPPmain"
            className="tab tab-lifted text-white text-[24px]"
          >
            SNPP-VIIRS
          </Link>
          <hr className="w-full border-white mt-4" />
        </div>

        <div className="flex-grow"></div>

        <div className="tabs flex flex-col items-start">
          <Link to="/result" className="tab tab-lifted text-white text-[24px]">
            Result history
          </Link>
          <hr className="w-full border-white mt-4" />
          <Link to="/install" className="tab tab-lifted text-white text-[24px]">
            Install
          </Link>
          <hr className="w-full border-white mt-4" />
          <a className="tab tab-lifted text-white text-[24px]">Log out</a>
        </div>
      </div>
      <div className="flex-1 p-10 bg-[#EDEDED]"></div>
    </div>
  );
}

export default Sidebar;
