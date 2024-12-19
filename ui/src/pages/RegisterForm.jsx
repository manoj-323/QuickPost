import React, { useState } from 'react';
import axios from 'axios';

import NavigationBar from '../components/NavigationBar';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
    // States to handle form data, success, and error messages
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { fetchUser } = useAuth();

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        console.log('submitting', formData);
        axios.post('http://127.0.0.1:8000/auth/register/', formData)
            .then((response) => {
                localStorage.setItem('access_token', response.data.access);
                localStorage.setItem('refresh_token', response.data.refresh); // Storing refresh token too
                setSuccess(true);
                setError('');
                fetchUser().then(()=>{
                    navigate('/profile');
                })
            })
            .catch((err) => {
                console.log('Error: ', err);
                setError('Registration failed. Please try again.');
                setSuccess(false);
            });
    };

    return (<div className="flex flex-col h-screen">
        <NavigationBar />

        <div className="flex flex-grow">
            <div className="sm:w-16 w-full sm:h-full h-16 sm:relative absolute bottom-0 left-0 sm:flex flex-col items-center sm:space-y-5 space-x-7 sm:space-x-0 bg-[#0A0A0A] text-white shadow-lg">
                <Sidebar />
            </div>


            <div className="border m-auto p-6 rounded-lg shadow-lg w-full max-w-md overflow-hidden bg-slate-950">
                <form onSubmit={handleSubmit} className="text-black flex flex-col space-y-4">
                    <div className="flex justify-center">
                        <input
                            className="p-2 rounded-md border border-gray-500 bg-red-100 w-full"
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            placeholder="Username"
                        />
                    </div>

                    <div className="flex justify-center">
                        <input
                            className="p-2 rounded-md border border-gray-500 bg-red-100 w-full"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Password"
                        />
                    </div>

                    {success && <p className="text-green-500 text-center">Registration successful!</p>}
                    {error && <p className="text-red-500 text-center">{error}</p>}

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white p-2 rounded-md w-full hover:bg-blue-700 transition duration-200"
                        >
                            Register
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    );
};

export default RegisterForm;
