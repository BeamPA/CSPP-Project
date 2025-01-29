import React from "react";
import Swal from "sweetalert2";
import { Theme, Button, Menu } from "react-daisyui";
import logo from './assets/logo-gistda.png';
import icon from './assets/arrow-up.png';

function App() {
  // ฟังก์ชันสำหรับ SweetAlert2
  const showAlert = () => {
    Swal.fire({
      title: "Hello!",
      text: "This is SweetAlert2",
      icon: "success",
      confirmButtonText: "Cool",
    });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-[#0E3B61] p-4 flex flex-col rounded-box h-screen ml-[-12px]">
        {/* โลโก้อยู่ด้านบน */}
        <img src={logo} alt="Logo GISTDA" className="w-32 mx-auto mb-4" />

        {/* Tab 1 อยู่ล่างโลโก้ */}
        <div className="tabs flex flex-col items-start mt-20">
          <hr className="w-full border-white mb-1" />
          <a className="tab tab-lifted tab-active text-white text-[24px]">SNPP-VIIRS</a>
          <hr className="w-full border-white mt-4" />
        </div>

        {/* ดัน Tab 2-3 ไปอยู่ล่างสุด */}
        <div className="flex-grow"></div>

        <div className="tabs flex flex-col items-start">
          <a className="tab tab-lifted text-white text-[24px]">Result history</a>
          <hr className="w-full border-white mt-4" />
          <a className="tab tab-lifted text-white text-[24px]">Install</a>
          <hr className="w-full border-white mt-4" />
          <a className="tab tab-lifted text-white text-[24px]">Log out</a>
        </div>
      </div>


      {/* Main Content */}
      <div className="flex-1 p-10 bg-[#f5f5f5]">


        {/* กล่องค้นหา */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search"
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        {/* กล่องนำเข้า RDR file */}
        <div>
          {/* <div className="flex items-center border border-gray-300 p-3 rounded-lg"> */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Import RDR file"
              // className="flex-1 border-none outline-none"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            {/* <img src={icon} alt=" " className="w-5 mx-auto mb-4" /> */}
          </div>
        </div>


        <label className="form-control w-full max-w-xs">
          <input type="file" className="file-input file-input-bordered w-full max-w-xs" />
        </label>




        {/* SweetAlert2 Button */}
        <div className="mt-4">
          <button onClick={showAlert} className="btn btn-primary">
            Show SweetAlert2
          </button>
        </div>

        {/* Theme Buttons */}
        <div className="mt-8 space-y-4">
          <Theme dataTheme="dark">
            <Button color="primary">Click me, dark!</Button>
          </Theme>

          <Theme dataTheme="light">
            <Button color="primary">Click me, light!</Button>
          </Theme>
        </div>

        {/* Menu */}
        <div className="mt-8">
          <Menu>
            <Menu.Item>
              <a>Item 1</a>
            </Menu.Item>
            <Menu.Item>
              <a>Item 2</a>
            </Menu.Item>
            <Menu.Item>
              <a>Item 3</a>
            </Menu.Item>
          </Menu>
        </div>
      </div>
    </div>
  );
}
export default App;