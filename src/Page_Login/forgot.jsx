import { Link } from 'react-router-dom';
import Swal from 'sweetalert2'; // ✅ นำเข้า SweetAlert2

function ForgotPassword() {
 const [email, setEmail] = useState('');
 // ฟังก์ชันตรวจสอบรูปแบบของอีเมล
 const validateEmail = (email) => {
   const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
   return emailRegex.test(email); // ใช้ Regular Expression ในการตรวจสอบว่าอีเมลถูกต้องตามรูปแบบ
 };
 const handleSendEmail = (e) => {
   e.preventDefault();
   // ตรวจสอบว่าอีเมลถูกต้องหรือไม่
   if (!email) {
     Swal.fire({
       title: 'Error!',
       text: 'Please enter your email.',
       icon: 'error',
       confirmButtonText: 'OK',
     });
     return;
   }
   // ถ้าอีเมลไม่ถูกต้อง
   if (!validateEmail(email)) {
     Swal.fire({
       title: 'Error!',
       text: 'Please enter a valid email (must contain @ and .com).',
       icon: 'error',
       confirmButtonText: 'OK',
     });
     return;
   }
   // ถ้าอีเมลถูกต้อง
   Swal.fire({
     title: 'Email Sent!',
     text: `A password reset link has been sent to ${email}`,
     icon: 'success',
     confirmButtonText: 'OK',
   });
   // สามารถเพิ่ม API call ที่นี่ถ้าต้องการส่งข้อมูลไปเซิร์ฟเวอร์
 };
 return (
<div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-500">
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
             className="input input-bordered w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
           />
</div>
<button
           type="submit"
           className="btn btn-primary w-full py-3 rounded-lg mb-4 bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300 ease-in-out transform hover:scale-105 focus:ring-2 focus:ring-blue-500"
>
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