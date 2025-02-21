import React, { useState, useEffect } from "react";
import Footer from "./fragments/footer/Footer";
import Header from "./fragments/header/Header";
import BoxAnnounce from './Homepage/BoxAnnounce';
import ScrollToTopButton from "./fragments/scrollTop/ScrollToTopButton";

const ImageCarousel = () => {
  const [currentImage, setCurrentImage] = useState(0);

  const images = [
    "src/images/backgr-1.jpg",
    "src/images/backgr-2.jpg",
    "src/images/backgr-3.jpg"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-96 md:h-screen overflow-hidden">
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute w-full h-full transition-transform duration-500 ease-in-out ${index === currentImage
            ? 'translate-x-0'
            : index < currentImage
              ? '-translate-x-full'
              : 'translate-x-full'
            }`}
        >
          <img
            src={img}
            alt={`Slide ${index + 1}`}
            className="w-full object-fill h-full"
          />
        </div>
      ))}

      {/* Overlay with text */}
      <div className="absolute inset-0 flex justify-center items-center bg-black/15">
        <h2 className="text-2xl text-amber-100 font-['Inter'] md:text-5xl font-black text-center text-stroke-black">
          TIỆN ÍCH <br/>QUẢN LÝ NGÔI NHÀ CỦA BẠN
        </h2>
      </div>


      {/* Navigation dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${currentImage === index ? 'bg-white' : 'bg-white/50'
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default function HomePage() {
  return (
    <>

      {/* Header Section */}
      <header className="fixed w-full z-50">
        <Header />
      </header>

      {/* Main Image Carousel Section */}
      <ImageCarousel />

      {/* Announcement Section */}
      <BoxAnnounce />

      {/* Footer Section */}
      <Footer />

      {/* Scroll To Top Button */}
      <ScrollToTopButton />
    </>
  );
}