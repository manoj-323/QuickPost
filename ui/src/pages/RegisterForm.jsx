import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';

import NavigationBar from '../components/NavigationBar';
import Sidebar from '../components/Sidebar';
import useAuth from '../hooks/useAuth';
import { Link } from 'react-router-dom';

const RegisterForm = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();
    const { auth, setAuth } = useAuth(); // Getting auth from the context

    // Handle form input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('Registering with data:', formData);

            // Send registration request
            const { data } = await axios.post('/auth/register/', formData);
            setSuccess(true);
            setError(null);

            console.log('Registration response:', data);
            // Set new auth data
            setAuth({
                accessToken: data.access,
                refreshToken: data.refresh,
                user: data.user
            });

            // Redirect to profile page after successful registration
            navigate('/profile');
        } catch (err) {
            setError('Registration failed. Please try again.');
            setSuccess(false);
            console.error('Error during registration:', err);
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
                            value={formData.username}
                            onChange={handleChange}
                            required
                            placeholder="Username"
                        />
                        <input
                            className="p-2 rounded-md border border-gray-500 bg-red-100"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Password"
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-200"
                        >
                            Register
                        </button>
                    </form>
                    {success && <p className="text-green-500 text-center">Registration successful!</p>}
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    <div className="text-center mt-4">
                        <Link to="/login" className="text-blue-600">Already have an account? Login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;
