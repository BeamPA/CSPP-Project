import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
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
function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      Swal.fire({ title: 'Error!', text: 'Please enter email and password.', icon: 'error', confirmButtonText: 'OK' });
      return;
    }
    try {
      // ✅ ใช้ Firebase Authentication ตรวจสอบข้อมูล
      await signInWithEmailAndPassword(auth, email, password);
      Swal.fire({ title: 'Success!', text: 'Login successful!', icon: 'success', confirmButtonText: 'OK' }).then(() => {
        onLogin(email);
        navigate('/SNPP'); // ไปที่หน้า main
      });
    } catch (error) {
      Swal.fire({ title: 'Error!', text: error.message, icon: 'error', confirmButtonText: 'OK' });
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-500">
      <div className="w-full max-w-sm p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center mb-6">
          <img src="https://maxarv2-cms-production.s3.amazonaws.com/uploads/image/image_value/1281/gistda-logo.png" alt="Logo" className="mx-auto w-40 h-20" />
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-black">Email</label>
            <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Enter your email"
              className="input input-bordered w-full rounded-lg transition-all duration-300 ease-in-out hover:border-blue-500 focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-black">Password</label>
            <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Enter your password"
              className="input input-bordered w-full rounded-lg transition-all duration-300 ease-in-out hover:border-blue-500 focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="text-right mb-4">
            <Link to="/forgot-password" className="text-xs text-black hover:underline">Forgot password?</Link>
          </div>
          <button type="submit" className="btn btn-primary w-full py-3 rounded-lg mb-4 bg-blue-500 text-white hover:bg-blue-600 transition-all hover:scale-105">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}
export default Login;