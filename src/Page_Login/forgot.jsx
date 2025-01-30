// src/ForgotPassword.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2'; // ✅ นำเข้า SweetAlert2

function ForgotPassword() {
  const [email, setEmail] = useState('');

  const handleSendEmail = (e) => {
    e.preventDefault();

    if (!email) {
      Swal.fire({
        title: 'Error!',
        text: 'Please enter your email',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    // ✅ แสดง SweetAlert2 เมื่ออีเมลถูกต้อง
    Swal.fire({
      title: 'Email Sent!',
      text: `A password reset link has been sent to ${email}`,
      icon: 'success',
      confirmButtonText: 'OK',
    });
    
    // สามารถเพิ่ม API call ที่นี่ถ้าต้องการส่งข้อมูลไปเซิร์ฟเวอร์
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-96 p-8 bg-white rounded-2xl shadow-lg">
        <div className="text-center mb-6">
          <img
            src="https://icon-library.com/images/mailbox-icon-png/mailbox-icon-png-1.jpg"
            alt="Logo"
            className="mx-auto w-20 h-20"
          />
        </div>
        
        <form onSubmit={handleSendEmail}>
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
          <button type="submit" className="btn btn-primary w-full">Send</button>
        </form>

        <div className="text-center mt-4">
          <Link to="/" className="text-sm text-black hover:underline">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
