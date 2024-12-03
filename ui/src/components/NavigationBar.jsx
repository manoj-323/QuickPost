import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';

function NavigationBar() {
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <nav className="fixed top-0 left-0 right-0 bg-slate-950 text-white flex justify-between items-center px-1 py-2 shadow-md z-10">
            <Link to="/">
                <img className="h-14 mt-2" src={logo} alt="quickpost" />
            </Link>
            <p className="text-lg">
                {currentPath === '/'
                    ? 'Home'
                    : currentPath === '/login'
                    ? 'Login'
                    : 'Register'}
            </p>
            <div>
                {currentPath !== '/login' && (
                    <Link
                        to="/login"
                        className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded-lg text-white text-sm"
                    >
                        Login
                    </Link>
                )}
            </div>
        </nav>
    );
}

export default NavigationBar;
