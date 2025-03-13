import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { auth, signInWithEmailAndPassword } from '../assets/firebase';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    if (user) {
      navigate("/snpp");
    }
  }, [navigate]);

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      Swal.fire({
        title: 'Error!',
        text: 'Please enter email and password.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    if (!validateEmail(email)) {
      Swal.fire({
        title: 'Error!',
        text: 'Invalid email format. Please enter a valid email address.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password.trim());
      Swal.fire({
        title: 'Success!',
        text: 'Login successful!',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        sessionStorage.setItem("user", email);
        onLogin(email);
        navigate('/snpp');
      });
    } catch (error) {
      let errorMessage = "Incorrect email or password";
      if (error.code === 'auth/invalid-credential') {
        errorMessage = "Incorrect email or password";
      } else {
        errorMessage = error.message;
      }

      Swal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setLoading(false);
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
          <div className="text-right mb-4">
            <Link to="/forgot-password" className="text-xs text-black hover:underline">Forgot password?</Link>
          </div>
          <button
            type="submit"
            className={`btn btn-primary w-full py-3 rounded-lg mb-4 bg-blue-500 text-white hover:bg-blue-600 transition-all hover:scale-105 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
