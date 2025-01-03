import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import axios from 'axios';

import NavigationBar from '../components/NavigationBar';
import Sidebar from '../components/Sidebar';
import useAuth from '../hooks/useAuth';


function LoginForm() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const userRef = useRef();
  const errRef = useRef();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from.pathname || "/";

  const { setAuth, setIsAuthenticated } = useAuth();


  useEffect(() => {
    userRef.current.focus();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://127.0.0.1:8000/auth/login/', formData);

      // Set auth context with user data (you may want to adjust based on API response)
      setAuth({ accessToken: data.access, refreshToken: data.refresh, user: data.user });
      setIsAuthenticated(true);

      localStorage.setItem('accessToken' , data.access);
      localStorage.setItem('refreshToken' , data.refresh);

      navigate(from, { replace: true }); // Redirect to home page on successful login
    } catch (err) {
      setError('Invalid credentials');
      setIsAuthenticated(false);
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <NavigationBar />
      <div className="flex flex-grow">
        <Sidebar />
        <div className="m-auto p-6 rounded-lg shadow-lg w-full max-w-md bg-slate-950">
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4 text-black">
            <input
              className="p-2 rounded-md border border-gray-500 bg-red-100"
              type="text"
              name="username"
              placeholder="Username"
              onChange={handleChange}
              ref={userRef}
              required
            />
            <input
              className="p-2 rounded-md border border-gray-500 bg-red-100"
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-200"
            >
              Login
            </button>
          </form>
          {error && <p ref={errRef} className="text-red-500 text-center">{error}</p>}
          <Link to="/register" className="text-blue-600 text-center mt-4 block">
            Don't have an account? Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
