import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import logo from '../assets/logo.png';
import search from '../assets/search.png';
import profile from '../assets/user-square.png';
import home from '../assets/home-page-white-icon.png';

function Sidebar() {
  return (
    <div className="fixed md:top-0 md:left-0 md:bottom-0 md:h-full bottom-0 left-0 right-0 bg-slate-950
     text-white w-full md:w-16 flex md:flex-col flex-row md:items-center items-center md:py-4 shadow-lg">

      {/* Main button container */}
      <div className="md:h-full mt-1 mb-1 h-10 flex md:flex-col flex-row md:justify-center justify-center w-full md:w-auto">
        <button className="hover:bg-gray-900">
          <Link to='/'>
          <img className="h-7 md:m-3 mx-3 " src={home} alt="Home" />
          </Link>
        </button>
        <button className="hover:bg-gray-900">
          <img className="h-7 md:m-3 mx-3 " src={search} alt="Search" />
        </button>
        <button className="hover:bg-gray-900">
          <img className="h-7 md:m-3 mx-3 bg-white" src={profile} alt="Profile" />
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
