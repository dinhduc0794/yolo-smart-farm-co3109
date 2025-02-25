import React, { useState } from "react";
import HeaderMain from "../header/HeaderMain";
import Sidebar from "../slidebar/Sidebar";
import { Menu, X } from 'lucide-react';

function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-200">
      {/* Mobile Menu Button */}
      <div className="lg:hidden px-4 pt-3">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          {isSidebarOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      <div className="p-4 flex flex-col lg:flex-row relative">
        {/* Sidebar */}
        <div className={`
          absolute lg:relative 
          top-0 left-0
          w-64 
          transform transition-transform duration-300
          lg:transform-none
          z-20
          ${isSidebarOpen ? 'translate-x-0 -ml-4' : '-translate-x-full lg:translate-x-0 lg:ml-0'}
        `}>
          <Sidebar />
        </div>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden "
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="lg:pl-14 w-full">
          <div className="border-b border-gray-100 mb-6">
            <HeaderMain />
          </div>
          <div className="bg-white rounded-lg shadow-lg min-h-screen">
            <main className="p-6">
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;