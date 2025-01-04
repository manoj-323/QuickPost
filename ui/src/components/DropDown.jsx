import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';
import { Link } from 'react-router-dom';

const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { setAuth, isAuthenticated, setIsAuthenticated } = useAuth();


  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const logout = () => {
    console.log('logging out');
    setAuth({});
    setIsAuthenticated(false);
  }

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={toggleDropdown}
        className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm p-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
      >
        more
        <svg
          className="-mr-1 ml-2 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-20 origin-top-right rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <Link to='/login'>
            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              <div className='p-2 hover:bg-slate-700 hover:text-white text-gray-700 rounded w-full'>
                Login
              </div>
            </div>
          </Link>
          <Link to='/register' >
            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              <div className='p-2 hover:bg-slate-700 hover:text-white text-gray-700 rounded w-full'>
                Register
              </div>
            </div>
          </Link>
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <button className="p-2 hover:bg-slate-700 hover:text-white text-gray-700 rounded w-full" type="button" onClick={() => {
              logout();
            }}>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
