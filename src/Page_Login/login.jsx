import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import Swal from 'sweetalert2'; // นำเข้า SweetAlert2

function Login({ onLogin }) {

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  // ฟังก์ชันตรวจสอบว่าอีเมลถูกต้องหรือไม่

  const validateEmail = (email) => {

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    return emailRegex.test(email); // ใช้ Regular Expression ในการตรวจสอบว่าอีเมลถูกต้องตามรูปแบบ

  };

  // ฟังก์ชันตรวจสอบว่าเป็นการกรอกภาษาอังกฤษหรือไม่

  const isEnglishInput = (input) => {

    return /^[A-Za-z0-9@.-]+$/.test(input); // ตรวจสอบให้กรอกเฉพาะภาษาอังกฤษ, ตัวเลข, @, . และ -

  };

  // ฟังก์ชันตรวจสอบความถูกต้องของข้อมูลก่อนส่ง

  const handleSubmit = (e) => {

    e.preventDefault();

    // ตรวจสอบกรณีที่ไม่ได้กรอกพาสเวิร์ด

    if (!password) {

      Swal.fire({

        title: 'Error!',

        text: 'Please enter your password.',

        icon: 'error',

        confirmButtonText: 'OK',

      });

      return; // หยุดการทำงานถ้ากรอกพาสเวิร์ดไม่ครบ

    }

    // ตรวจสอบกรณีที่ไม่ได้กรอกอีเมล

    if (!email) {

      Swal.fire({

        title: 'Error!',

        text: 'Please enter your email.',

        icon: 'error',

        confirmButtonText: 'OK',

      });

      return; // หยุดการทำงานถ้ากรอกอีเมลไม่ครบ

    }

    // ตรวจสอบว่าอีเมลถูกต้องตามรูปแบบหรือไม่

    if (!validateEmail(email)) {

      Swal.fire({

        title: 'Error!',

        text: 'Please enter a valid email (must contain @ and .com).',

        icon: 'error',

        confirmButtonText: 'OK',

      });

      return; // หยุดการทำงานถ้าอีเมลไม่ถูกต้อง

    }


    // แสดงข้อความเมื่อข้อมูลครบถ้วนและเข้าสู่ระบบสำเร็จ

    Swal.fire({

      title: 'Login Successful',

      text: 'You have successfully logged in!',

      icon: 'success',

      confirmButtonText: 'OK',

    }).then(() => {

      onLogin(email); // เรียกใช้ฟังก์ชัน onLogin หลังจาก SweetAlert ทำงานเสร็จ

    });

  };

  // ฟังก์ชันที่ใช้สำหรับลิงก์ "Forgot password?"

  const handleForgotPasswordClick = () => {

    navigate('/forgot-password');

  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-500">
      <div className="w-full max-w-sm p-8 bg-white bg-opacity-90 rounded-xl shadow-lg">
        <div className="text-center mb-6">
          <img

            src="https://maxarv2-cms-production.s3.amazonaws.com/uploads/image/image_value/1281/gistda-logo.png"

            alt="Logo"

            className="mx-auto w-40 h-20"

          />
        </div>
        <form onSubmit={handleSubmit} noValidate>

          {/* ฟอร์มกรอกอีเมล */}
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

              className="input input-bordered w-full rounded-lg transition-all duration-300 ease-in-out hover:border-blue-500 focus:ring-2 focus:ring-blue-500"

            />
          </div>

          {/* ฟอร์มกรอกรหัสผ่าน */}
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

              className="input input-bordered w-full rounded-lg transition-all duration-300 ease-in-out hover:border-blue-500 focus:ring-2 focus:ring-blue-500"

            />
          </div>

          {/* ลิงก์ "Forgot password?" */}
          <div onClick={handleForgotPasswordClick} className="text-right mb-4">
            <a href="#" className="text-xs text-black hover:underline">Forgot password?</a>
          </div>

          {/* ปุ่มล็อกอิน */}
          <button

            type="submit"

            className="btn btn-primary w-full rounded-lg mb-4 transition-all duration-300 ease-in-out hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 transform transition-all duration-300 ease-in-out hover:scale-105"
          >

            Log In
          </button>
        </form>
      </div>
    </div>

  );

}

export default Login;
