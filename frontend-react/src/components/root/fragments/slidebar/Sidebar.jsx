import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SidebarItem from "./SidebarItem";
import Cookies from "js-cookie";

const Sidebar = () => {
  const fullName = localStorage.getItem("fullName");
  const location = useLocation();
  const navigate = useNavigate();
  const [highlightedItem, setHighlightedItem] = useState();
  const [isLoading, setIsLoading] = useState(false);
  // State để quản lý việc mở hay đóng sub-menu của "Quản lý thiết bị"
  const [deviceManagementExpanded, setDeviceManagementExpanded] = useState(false);

  // Danh sách mục sidebar chính
  const items = [
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/cc51959b7aa574dbb1fb56269de103e2d9b884f56bffb75d18b1579b4ef3ff89?placeholderIfAbsent=true&apiKey=985f1fb8be044ffd914af5aef5360e96",
      text: "Thông tin tài khoản",
      link: "/account",
    },
    {
      icon: "src/images/tablet-smartphone.png",
      text: "Quản lý thiết bị",
      // Không có link cho mục này, chỉ toggle submenu
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/1c4134eae08bde30084c70bf9ce3fba0cffea383b3ec61d772b2a1e70116cb49?placeholderIfAbsent=true&apiKey=985f1fb8be044ffd914af5aef5360e96",
      text: "Lịch sử hoạt động",
      link: "/log-farm",
    },
    {
      icon: "src/images/icon-lock-nav.png",
      text: "Đổi mật khẩu",
      link: "/change-password",
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/9e6254714a807272e104cd11bfb80c4546f8c63032d7d5999b464192ba5220d9?placeholderIfAbsent=true&apiKey=985f1fb8be044ffd914af5aef5360e96",
      text: "Đăng xuất",
      link: "/login",
    },
  ];

  // Danh sách các mục con của "Quản lý thiết bị" với đường dẫn trực tiếp
  const deviceManagementSubItems = [
    {
      icon: "src/images/icon-setting-nav.png",
      text: "Cài đặt hệ thống giám sát",
      link: "/setting",
    },
    {
      icon: "src/images/chart-column.png",
      text: "Thống kê",
      link: "/summary",
    },
  ];

  useEffect(() => {
    const currentPath = location.pathname;
    // Nếu đường dẫn hiện tại thuộc deviceManagementSubItems, mở sub-menu và không highlight mục cha
    if (deviceManagementSubItems.some(item => item.link === currentPath)) {
      setDeviceManagementExpanded(true);
      setHighlightedItem(null);
    } else {
      // Nếu thuộc các mục chính thì highlight mục tương ứng (hoặc không highlight nếu không tìm thấy)
      const currentIndex = items.findIndex(item => item.link === currentPath);
      setHighlightedItem(currentIndex !== -1 ? currentIndex : null);
    }
  }, [location.pathname, items]);

  const handleItemClick = (index, link) => {
    // Nếu click vào mục "Quản lý thiết bị" thì chỉ toggle hiển thị sub-menu
    if (items[index].text === "Quản lý thiết bị") {
      setDeviceManagementExpanded((prev) => !prev);
      return;
    }
    if (highlightedItem === index) return;
    setIsLoading(true);
    setTimeout(() => {
      setHighlightedItem(index);
      if (link === "/login") {
        handleLogout();
      } else {
        navigate(link);
      }
      setIsLoading(false);
    }, 500);
  };

  const handleSubItemClick = (link) => {
    setIsLoading(true);
    setTimeout(() => {
      navigate(link);
      setIsLoading(false);
    }, 500);
  };

  const handleLogout = () => {
    Cookies.remove("jwt");
    localStorage.clear();
    navigate("/login");
  };

  return (
    <aside className="flex flex-col max-md:w-full w-[220px]">
      <div
        className="flex flex-col grow items-center px-1 pt-3.5 text-sm leading-snug 
          text-[#F2E2C4] bg-[#5014109f] max-md:pb-15 rounded-2xl shadow-lg fixed 
          h-[calc(100vh-2rem)] top-4 left-5 overflow-y-auto border border-[#D4A373]"
      >
        <img
          loading="lazy"
          src="src/images/user-avt.png"
          alt="User avatar"
          className="object-contain rounded-full aspect-square w-[70px]"
        />
        <nav
          className={`flex flex-col self-stretch w-full ${
            isLoading ? "pointer-events-none opacity-50" : ""
          }`}
        >
          {items.map((item, index) => (
            <div key={index}>
              <SidebarItem
                icon={item.icon}
                text={item.text}
                isHighlighted={highlightedItem === index}
                link={item.link}
                onClick={() => handleItemClick(index, item.link)}
                showText={true}
                // Vô hiệu hóa link cho mục "Quản lý thiết bị"
                disableLink={item.text === "Quản lý thiết bị"}
              />
              {/* Hiển thị submenu nếu là "Quản lý thiết bị" và đã được mở */}
              {item.text === "Quản lý thiết bị" && deviceManagementExpanded && (
                <div className="ml-4">
                  {deviceManagementSubItems.map((subItem, subIndex) => (
                    <SidebarItem
                      key={`sub-${subIndex}`}
                      icon={subItem.icon}
                      text={subItem.text}
                      isHighlighted={location.pathname === subItem.link}
                      link={subItem.link}
                      onClick={() => handleSubItemClick(subItem.link)}
                      showText={true}
                      isSubItem={true}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;