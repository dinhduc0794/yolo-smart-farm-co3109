import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`${
        isSticky ? "shadow-lg bg-[#FAF3E0]" : "bg-[#FDF7E3]"
      } md:sticky top-0 z-10 transition-all`}
    >
      <div className="flex justify-center items-center w-full">
        <div
          className="bg-gradient-to-r from-[#FDF6E3] to-[#F5E7DA] border w-full flex md:flex-row justify-between items-center py-3 px-4 md:py-4 md:px-8"
        >
          {/* Logo Section */}
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-3">
              <img
                className="w-10 h-10 md:w-16 md:h-16 object-cover"
                src="src/images/logo-page.avif"
                alt="HCMUT Official Logo"
              />
              <h2 className="text-base md:text-2xl font-semibold hidden md:block">
                SMART HOME
              </h2>
            </a>
          </div>

          {/* Tagline Section */}
          <h1 className="text-[#5A4637] text-sm md:text-2xl font-black font-['Inter'] md:ml-10 text-center">
            HỘI NHẬP - ĐỔI MỚI - PHÁT TRIỂN
          </h1>

          {/* Login Button */}
          <Link to="/login">
            <div
              className="bg-[#B08B4F] text-white text-sm md:text-lg px-4 md:px-8 py-3 rounded-lg hover:bg-[#976C42] focus:outline-none focus:ring-2 focus:ring-[#976C42] focus:ring-opacity-50 transition"
            >
              Đăng Nhập
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
