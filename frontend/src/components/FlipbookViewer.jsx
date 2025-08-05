import React from "react";
import HTMLFlipBook from "react-pageflip";

const FlipbookViewer = () => {
  const pages = [
    "/pages/sel1.png",
    "/pages/sel2.png",
    "/pages/sel3.png",
    "/pages/sel4.png",
    "/pages/sel5.png",
    "/pages/sel6.png",      
    "/pages/sel7.png",
    "/pages/sel8.png",
    "/pages/sel9.png",
    "/pages/sel10.png",
    "/pages/sel11.png",
    "/pages/sel12.png",
    "/pages/sel13.png",
    "/pages/sel14.png",
    "/pages/sel15.png",                 
    "/pages/sel16.png",
    "/pages/sel17.png",
    "/pages/sel18.png",
    "/pages/sel19.png",
    "/pages/sel20.png",
    "/pages/sel21.png",
    "/pages/sel22.png",
    "/pages/sel23.png",
    "/pages/sel24.png",
    "/pages/sel25.png",
    "/pages/sel26.png",
    "/pages/sel27.png",
    "/pages/sel28.png",
    "/pages/sel29.png",
    "/pages/sel30.png",
    "/pages/sel31.png",
    "/pages/sel32.png",
    "/pages/sel33.png",
    "/pages/sel34.png",
    "/pages/sel35.png",
    "/pages/sel36.png",
    "/pages/sel37.png", 
    "/pages/sel38.png",
    "/pages/sel39.png",         
    "/pages/sel40.png",
    "/pages/sel41.png",
    "/pages/sel42.png",
    "/pages/sel43.png",
    "/pages/sel44.png",
    "/pages/sel45.png",
    "/pages/sel46.png",
  ];

  return (
    <div className="flex justify-center p-6 bg-[#fff2f2] min-h-screen">
      <HTMLFlipBook width={500} height={700} showCover mobileScrollSupport>
        {pages.map((src, idx) => (
          <div key={idx} className="page">
            <img src={src} alt={`Page ${idx + 1}`} style={{ width: "100%", height: "100%" }} />
          </div>
        ))}
      </HTMLFlipBook>
    </div>
  );
};

export default FlipbookViewer;
