import React from "react";

export default function HeaderMain() {
  return (
    <div className="bg-[#FDF6E3] w-full h-auto flex items-center py-4 px-3 md:py-3 md:px-8 shadow-lg ">
      {/* Logo Section */}
      <div className="flex items-center">
        <a href="/" className="flex items-center no-underline">
          <img
            className="h-12 w-auto md:w-16 md:h-16 object-cover"
            src="src/images/logo-page.avif"
            alt="HCMUT Official Logo"
          />
          {/* Ẩn chữ "SMART HOME" trên màn hình nhỏ */}
          <h2 className="ml-3 md:ml-4 text-base md:text-2xl font-semibold hidden md:block text-[#5A4637]">
            SMART HOME
          </h2>
        </a>
      </div>

      {/* Header Text Section */}
      <h1 className="text-[#5A4637] text-base md:text-2xl font-black font-['Inter'] text-center drop-shadow-xl flex-1 mx-4">
        Dịch vụ quản lý ngôi nhà của bạn một cách nhanh chóng 
      </h1>
    </div>
  );
}
