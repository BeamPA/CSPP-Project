import logo from "../assets/logo-gistda.png";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = (event) => {
    event.preventDefault();
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your session.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "OK",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.removeItem("user");  // ลบข้อมูลการล็อกอินจาก sessionStorage
        navigate("/");  // นำทางไปหน้า Login
      }
    });
  };


  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-[#0E3B61] p-4 flex flex-col rounded-box h-screen ml-[-12px]">
        {/* โลโก้อยู่ด้านบน */}
        <img src={logo} alt="Logo GISTDA" className="w-32 mx-auto mb-4" />

        <div className="tabs flex flex-col items-start mt-20">
          <hr className="w-full border-white mb-1" />
          <Link
            to="/snpp"
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
          <Link to="/" className="tab tab-lifted text-white text-[24px]" onClick={handleLogout}>
            Log out
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
