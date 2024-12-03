import axios from 'axios';
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import NavigationBar from '../components/NavigationBar';
import Sidebar from '../components/Sidebar';

function LoginForm() {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post('http://127.0.0.1:8000/auth/login/', formData)
            .then((response) => {
                localStorage.setItem('access', response.data.access);
                localStorage.setItem('refresh', response.data.refresh);
                setSuccess(true);
                setError('');
            })
            .catch((err) => {
                setSuccess(false);
                setError('Login failed. Please try again.');
            });
    };

    return (
        <div>
            <NavigationBar />
            <Sidebar />
            <div className="bg-slate-950 h-screen flex">
                <div className="border m-auto p-4 rounded-lg shadow-lg w-full max-w-md overflow-hidden">
                    <form onSubmit={handleSubmit} className="text-black flex flex-col space-y-4 border p-6 rounded">
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

                        {success && <p className="text-green-500 text-center">Login successful!</p>}
                        {error && <p className="text-red-500 text-center">{error}</p>}

                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="bg-blue-600 text-white p-2 rounded-md w-full hover:bg-blue-700 transition duration-200"
                            >
                                Login
                            </button>
                        </div>
                    </form>
                    <Link to='/register'>
                        <button className='w-full' value="Register">Already have acccount ? <span className='text-blue-600 inline-block items-center w-full'>Register</span></button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default LoginForm;
