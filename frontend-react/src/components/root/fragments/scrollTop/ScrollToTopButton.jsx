import React, { useState, useEffect } from "react";


function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const toggleVisibility = () => {
    // Thay đổi từ window.pageYOffset sang window.scrollY
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4">
    {isVisible && (
      <button
        onClick={scrollToTop}
        className="bg-[#B08B4F] hover:bg-[#976C42] text-white font-bold py-2 px-4 shadow-lg"
      >
        ↑
      </button>
    )}
  </div>
  );
}

export default ScrollToTopButton;
