import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { Menu, X } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { SignIn, useUser } from "@clerk/clerk-react";

const Layout = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [sidebar, setSidebar] = useState(false);
  const [active, setActive] = useState("Tools");

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Tools", path: "/ai" },
  ];

  const handleNavigate = (item) => {
    setActive(item.name);
    navigate(item.path);
  };

  return user ? (
    <div className="flex flex-col bg-[#0f172a] text-white h-screen overflow-hidden">

      {/* ------------------ Header / Navbar ------------------ */}
      <nav className="w-full px-6 sm:px-9 min-h-14 flex items-center justify-between border-b border-gray-800 bg-[#0f172a]">
        <img
          src={assets.logo}
          className="cursor-pointer w-28"
          alt="logo"
          onClick={() => navigate("/")}
        />

        <div className="flex items-center gap-6">
          {/* Menu Items */}
          <div className="hidden sm:flex gap-6">
            {menuItems.map((item) => (
              <span
                key={item.name}
                onClick={() => handleNavigate(item)}
                className={`cursor-pointer text-sm transition-all ${
                  active === item.name
                    ? "text-purple-400"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {item.name}
              </span>
            ))}
          </div>

          {/* Mobile Toggle Icon */}
          {sidebar ? (
            <X
              onClick={() => setSidebar(false)}
              className="w-6 h-6 text-gray-400 sm:hidden"
            />
          ) : (
            <Menu
              onClick={() => setSidebar(true)}
              className="w-6 h-6 text-gray-400 sm:hidden"
            />
          )}
        </div>
      </nav>

      {/* ------------------ Main Layout ------------------ */}
      <div className="flex flex-1 h-[calc(100vh-56px)] overflow-hidden">
        {/* Fixed Sidebar on Desktop */}
        <div className="hidden sm:block fixed top-14 left-0 h-[calc(100vh-56px)] w-64 z-40">
          <Sidebar sidebar={true} setSidebar={setSidebar} />
        </div>

        {/* Toggle Sidebar on Mobile */}
        {sidebar && (
          <div className="block sm:hidden fixed top-14 left-0 h-[calc(100vh-56px)] w-64 z-50 bg-[#0f172a]">
            <Sidebar sidebar={sidebar} setSidebar={setSidebar} />
          </div>
        )}

        {/* Page Content */}
        <div className="flex-1 ml-0 sm:ml-62 overflow-y-auto bg-[#0f172a] p-1 sm:p-1">
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center h-screen bg-black">
      <SignIn />
    </div>
  );
};

export default Layout;
