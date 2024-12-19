import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import Dropdown from './DropDown';
import useAuth from '../hooks/useAuth';

function NavigationBar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const { isAuthenticated } = useAuth();

  const getPathLabel = (path) => {
    const pathLabels = {
      '/': 'Home',
      '/login': 'Login',
      '/register': 'Register',
      '/profile': 'Profile',
      '/search': 'Search',
      '/user': 'User',
    };
    return pathLabels[path];
  };

  return (
    <nav className="top-0 left-0 right-0 bg-[#0A0A0A] text-white flex items-center justify-between pr-6 pl-2 py-4 shadow-md">
      {/* Logo on the left */}
      <Link to="/" className="flex-shrink-0">
        <img className="h-12" src={logo} alt="quickpost" />
      </Link>

      {/* Centered Label */}
      <p className="text-lg font-semibold absolute left-1/2 transform -translate-x-1/2">
        {getPathLabel(currentPath)}
      </p>

      {/* Right side actions */}
      <div className="flex items-center space-x-4">
        {(currentPath !== '/login' &&!isAuthenticated ) && (
          <Link
            to="/login"
            className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded-lg text-white text-sm"
          >
            Login
          </Link>
        )}
        {currentPath === '/profile' && <Dropdown />}
      </div>
    </nav>
  );
}

export default NavigationBar;
