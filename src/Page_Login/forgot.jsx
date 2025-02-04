import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { initializeApp } from 'firebase/app';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
// การตั้งค่า Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBTjMlc736LoTIc8NkJ7z-yFwcGKBnGJmA",
  authDomain: "csppproject-5568d.firebaseapp.com",
  projectId: "csppproject-5568d",
  storageBucket: "csppproject-5568d.firebasestorage.app",
  messagingSenderId: "609930927322",
  appId: "1:609930927322:web:c0d7077444519d976459e3",
  measurementId: "G-8Y45PZZFRH"
};
// เชื่อมต่อ Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
function ForgotPassword() {
  const [email, setEmail] = useState('');
  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!email) {
      Swal.fire({ title: 'Error!', text: 'Please enter your email.', icon: 'error', confirmButtonText: 'OK' });
      return;
    }
    try {
      // ✅ ใช้ Firebase Authentication ส่งอีเมลรีเซ็ตรหัสผ่าน
      await sendPasswordResetEmail(auth, email);
      Swal.fire({ title: 'Success!', text: 'A password reset link has been sent to your email.', icon: 'success', confirmButtonText: 'OK' });
    } catch (error) {
      Swal.fire({ title: 'Error!', text: error.message, icon: 'error', confirmButtonText: 'OK' });
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-500">
      <div className="w-96 p-8 bg-white rounded-2xl shadow-lg">
        {/* เพิ่มโลโก้ด้านบน */}
        <div className="text-center mb-6">
          <img src="https://static.vecteezy.com/system/resources/previews/007/536/069/non_2x/password-reset-icon-for-apps-vector.jpg" alt="Logo" className="mx-auto w-40 h-40" />
          <h1 className="text-xl font-bold text-black">FORGOT PASSWORD?</h1>
        </div>
        <form onSubmit={handleSendEmail}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-black">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Enter your email"
              className="input input-bordered w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all" />
          </div>
          <button type="submit" className="btn btn-primary w-full py-3 rounded-lg mb-4 bg-blue-500 text-white hover:bg-blue-600 transition-all hover:scale-105">
            RESET PASSWORD
          </button>
        </form>
        <div className="text-center mt-4">
          <Link to="/" className="text-sm text-black hover:underline">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}
export default ForgotPassword;