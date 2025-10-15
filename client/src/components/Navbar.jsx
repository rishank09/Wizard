import React, { useState } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const [active, setActive] = useState('Home');

  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'Tools', path: '/ai' },
    { name: 'Contact Us', path: '/contact' },
  ];

  const handleNavigate = (item) => {
    setActive(item.name);
    navigate(item.path);
  };

  return (
    <div className='fixed z-50 w-full backdrop-blur-2xl bg-[#0b002b]/20 flex justify-between items-center py-1.5 px-3 sm:px-8 xl:px-20'>
      
      {/* Logo */}
      <img
        src={assets.logo}
        alt="Logo"
        className='w-28 sm:w-32 cursor-pointer ml-0'
        onClick={() => handleNavigate({ name: 'Home', path: '/' })}
      />

      {/* Right Side: Menu + Button */}
      <div className="flex items-center gap-4 sm:gap-6">

        {/* Menu Links */}
        <div className="flex items-center gap-4">
          {menuItems.map((item) => (
            <span
              key={item.name}
              onClick={() => handleNavigate(item)}
              className={`cursor-pointer text-sm sm:text-base transition-all
                ${active === item.name ? 'text-[#9b59b6]' : 'text-gray-300 hover:text-gray-100'}`}
            >
              {item.name}
            </span>
          ))}
        </div>

        {/* Auth / User Button */}
        {user ? (
          <UserButton />
        ) : (
          <button
            onClick={openSignIn}
            className="flex items-center gap-2 rounded-full text-sm cursor-pointer bg-[#9b59b6]/90 
                       text-white px-5 sm:px-6 py-1.5 hover:scale-105 active:scale-95 transition shadow-sm hover:shadow-purple-400/40"
          >
            Get started <ArrowRight className='w-4 h-4' />
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
