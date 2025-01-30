// src/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // นำเข้า SweetAlert2

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("🔍 Checking form validation...");

    if (!email || !password) {
      console.log("❌ ข้อมูลไม่ครบ");
      Swal.fire({
        title: 'Error!',
        text: 'กรุณากรอกข้อมูลให้ครบถ้วน',
        icon: 'error',
        confirmButtonText: 'ตกลง',
      });
      return; // ❗ หยุดการทำงานถ้ากรอกข้อมูลไม่ครบ
    }

    console.log("✅ ข้อมูลครบถ้วน! กำลังแสดง SweetAlert...");
    
    Swal.fire({
      title: 'Login Successful',
      text: 'You have successfully logged in!',
      icon: 'success',
      confirmButtonText: 'OK',
    }).then(() => {
      console.log("🔄 Calling onLogin function...");
      onLogin(email); // ✅ ให้เรียกใช้ onLogin หลังจาก Swal.fire ทำงานเสร็จ
    });
  };

  const handleForgotPasswordClick = () => {
    navigate('/forgot-password');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-96 p-8 bg-gray-100 rounded-2xl shadow-lg">
        <div className="text-center mb-6">
          <img
            src="https://maxarv2-cms-production.s3.amazonaws.com/uploads/image/image_value/1281/gistda-logo.png"
            alt="Logo"
            className="mx-auto w-40 h-20"
          />
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-black">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="input input-bordered w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-black">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="input input-bordered w-full"
            />
          </div>
          <div onClick={handleForgotPasswordClick} className="text-right mb-4">
            <a href="#" className="text-sm text-black hover:underline">Forgot password?</a>
          </div>
          <button type="submit" className="btn btn-primary w-full">Log In</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
