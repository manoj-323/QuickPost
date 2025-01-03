import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Import assets
import search from '../assets/search.png';
import profile from '../assets/userProfile.png';
import home from '../assets/home-page-white-icon.png';
import add from '../assets/add-round-white-icon.png'

const NavButton = ({ to, icon, alt }) => (
  <button className="hover:bg-[#1A1A1A] rounded-2xl">
    <Link to={to}>
      <img className="h-9 sm:my-3 sm:mx-auto mx-3" src={icon} alt={alt} />
    </Link>
  </button>
);

function Sidebar() {

  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { to: '/', icon: home, alt: 'Home' },
    { to: '/search', icon: search, alt: 'Search' },
    { to: '/profile', icon: profile, alt: 'Profile' },
  ];

  return (
    <div className="sm:h-full h-16 flex sm:flex-col flex-row justify-center sm:space-y-5 sm:space-x-0 space-x-7 w-full sm:w-20">
      {navItems.map((item, index) => (
        <NavButton key={index} to={item.to} icon={item.icon} alt={item.alt} />
      ))}

      <button className="hover:bg-[#1A1A1A] rounded-2xl" onClick={() => {
        setIsOpenPopup(true);
        navigate('/post'); // Passing onClose via state
      }}><img src={add} className="h-9 sm:my-4 sm:mx-auto mx-3" ></img></button>
    </div>
  );
}

export default Sidebar;
