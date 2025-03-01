import React from "react";
import { Link } from "react-router-dom";

function SidebarItem({ icon, text, isHighlighted, link, onClick, isSubItem, disableLink, showText }) {
  const containerClass = `flex items-center ${
    isSubItem ? "py-2 mt-2" : "py-3 mt-5"
  } max-w-full w-full transition-all duration-300 ease-in-out rounded-lg ${
    isHighlighted ? "bg-[#D4A373] text-black" : "hover:bg-[#CC7A00] hover:brightness-110"
  }`;

  const iconClass = `object-contain shrink-0 self-stretch my-auto ${
    isSubItem ? "w-4" : "w-6"
  } aspect-square`;

  const textClass = `self-stretch my-auto ${
    isSubItem ? "w-[100px] text-sm" : "w-[140px] font-bold"
  } ${isHighlighted ? "text-black" : "text-[#F2E2C4]"}`;

  return (
    <div className={containerClass} onClick={onClick}>
      {disableLink ? (
        <div className="flex items-center gap-4 px-4 w-full">
          <img
            loading="lazy"
            src={icon}
            alt=""
            className={iconClass}
            style={{
              filter: isHighlighted ? "invert(1)" : "invert(0)",
              transition: "filter 0.3s ease"
            }}
          />
          {showText && <div className={textClass}>{text}</div>}
        </div>
      ) : (
        <Link to={link} className="flex items-center gap-4 px-4 w-full">
          <img
            loading="lazy"
            src={icon}
            alt=""
            className={iconClass}
            style={{
              filter: isHighlighted ? "invert(1)" : "invert(0)",
              transition: "filter 0.3s ease"
            }}
          />
          {showText && <div className={textClass}>{text}</div>}
        </Link>
      )}
    </div>
  );
}

export default SidebarItem;
