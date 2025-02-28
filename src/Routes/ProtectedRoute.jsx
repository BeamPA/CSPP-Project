import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const user = sessionStorage.getItem("user");

  useEffect(() => {
    // ถ้าไม่มีข้อมูลการล็อกอิน, ให้นำทางไปหน้า Login
    if (!user) {
      navigate("/");  // หรือสามารถใช้ `window.location.reload()` เพื่อรีเฟรชหน้า
    }
  }, [navigate, user]);

  return user ? <Outlet /> : null; // ถ้ามี user ให้แสดง Outlet, ถ้าไม่มีให้ redirect ไปหน้า Login
};

export default ProtectedRoute;
