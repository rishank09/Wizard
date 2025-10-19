import { Protect, useClerk, useUser } from '@clerk/clerk-react';
import {
  Eraser, FileText, Hash, House, Image, LogOut, Scissors,
  SquarePen, Users , Megaphone
} from 'lucide-react';
import React from 'react';
import { NavLink } from 'react-router-dom';
import skybg from '../assets/skybg.png';

const navItems = [
  { to: '/ai', lable: 'Dashboard', Icon: House },
  
  { to: '/ai/write-assignment', lable: 'Write Assignment', Icon: SquarePen },
  { to: '/ai/create-caption', lable: 'Create Caption', Icon: Megaphone   },
  { to: '/ai/generate-images', lable: 'Generate Images', Icon: Image },
  { to: '/ai/remove-background', lable: 'Remove Background', Icon: Eraser },
  { to: '/ai/remove-object', lable: 'Remove Object', Icon: Scissors },
  { to: '/ai/contract-insights', lable: 'Contract Insights', Icon: FileText },
  { to: '/ai/review-resume', lable: 'Review Resume', Icon: FileText },
   { to: '/ai/blog-titles', lable: 'Blog Titles', Icon: Hash },
  { to: '/ai/community', lable: 'Community', Icon: Users },
  
];

const Sidebar = ({ sidebar, setSidebar }) => {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();

  return (
    <div
      className={`
        fixed top-14 left-0 z-50 w-64 h-[calc(100vh-3.5rem)]
        bg-cover bg-center text-gray-300 shadow-xl
        ${sidebar ? 'translate-x-0' : 'max-sm:-translate-x-full'}
        transition-all duration-300 ease-in-out
      `}
      style={{
        backgroundImage: `url(${skybg})`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 z-0" />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">

        {/* Top: Profile */}
        <div className="p-4 flex flex-col items-center text-center border-b border-gray-800">
          <img
            src={user.imageUrl}
            alt="User avatar"
            className="w-14 h-14 rounded-full border border-gray-600"
          />
          <h1 className="mt-2 text-sm font-semibold text-gray-100">
            {user.fullName}
          </h1>
        </div>

        {/* Middle: Nav Items */}
        <div className="flex-1 overflow-y-auto hide-scrollbar px-2 py-4">
          <p className="text-xs uppercase text-gray-400 mb-2 px-2">Menu</p>
          <div className="space-y-1">
            {navItems.map(({ to, lable, Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/ai'}
                onClick={() => setSidebar(false)}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-2 rounded-md text-sm transition-all duration-200
                  ${isActive
                    ? 'bg-gray-800 text-white shadow-md'
                    : 'hover:text-purple-400 hover:drop-shadow-[0_0_5px_#a855f7] text-gray-300'}
                `}
              >
                <Icon className="w-4 h-4 text-gray-400" />
                <span>{lable}</span>
              </NavLink>
            ))}
          </div>
        </div>

        {/* Bottom: User Settings */}
        <div className="p-4 border-t border-gray-800 flex items-center justify-between">
          <div
            onClick={openUserProfile}
            className="flex gap-3 items-center cursor-pointer hover:bg-gray-800 p-2 rounded-md transition"
          >
            <img
              src={user.imageUrl}
              alt=""
              className="w-9 h-9 rounded-full border border-gray-600"
            />
            <div>
              <h1 className="text-sm font-medium text-gray-100">
                {user.fullName}
              </h1>
              <p className="text-xs text-gray-400">
                <Protect plan="premium" fallback="Free">Premium</Protect> plan
              </p>
            </div>
          </div>
          <LogOut
            onClick={signOut}
            className="w-5 h-5 text-gray-400 hover:text-red-500 cursor-pointer transition"
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
