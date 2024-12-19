import React from 'react';
import { Link } from 'react-router-dom';

// Import assets
import search from '../assets/search.png';
import profile from '../assets/userProfile.png';
import home from '../assets/home-page-white-icon.png';

// Reusable NavButton Component
const NavButton = ({ to, icon, alt }) => (
  <button className="hover:bg-[#1A1A1A] rounded-2xl">
    <Link to={to}>
      <img className="h-9 sm:my-3 sm:mx-auto mx-3" src={icon} alt={alt} />
    </Link>
  </button>
);

function Sidebar() {
  const navItems = [
    { to: '/', icon: home, alt: 'Home' },
    { to: '/search', icon: search, alt: 'Search' },
    { to: '/profile', icon: profile, alt: 'Profile' },
  ];

  return (
    <div className="sm:h-full h-16 flex sm:flex-col flex-row justify-center sm:space-y-5 sm:space-x-0 space-x-7 w-full sm:w-16">
      {navItems.map((item, index) => (
        <NavButton key={index} to={item.to} icon={item.icon} alt={item.alt} />
      ))}
    </div>
  );
}

export default Sidebar;
