import React from "react";

export const BackgroundBubbles: React.FC = () => {
    const bubbles = [
        // Top Row
        { src: "/assets/bubbles/bubble1.png", size: 80, top: "5%", left: "5%", anim: "animate-float" },
        { src: "/assets/bubbles/bubble2.png", size: 95, top: "8%", left: "35%", anim: "animate-float-slow" },
        { src: "/assets/bubbles/bubble3.png", size: 90, top: "4%", left: "65%", anim: "animate-float-alt" },
        { src: "/assets/bubbles/bubble4.png", size: 85, top: "7%", left: "90%", anim: "animate-float" },
      
        // Mid Row
        { src: "/assets/bubbles/bubble2.png", size: 100, top: "30%", left: "15%", anim: "animate-float-slow" },
        { src: "/assets/bubbles/bubble4.png", size: 95, top: "60%", left: "50%", anim: "animate-float-alt" },
        { src: "/assets/bubbles/bubble1.png", size: 80, top: "30%", left: "78%", anim: "animate-float" },
      
        // Bottom Row
        { src: "/assets/bubbles/bubble3.png", size: 90, top: "75%", left: "8%", anim: "animate-float-alt" },
        { src: "/assets/bubbles/bubble1.png", size: 85, top: "90%", left: "28%", anim: "animate-float" },
        { src: "/assets/bubbles/bubble2.png", size: 100, top: "78%", left: "58%", anim: "animate-float-slow" },
        { src: "/assets/bubbles/bubble4.png", size: 95, top: "90%", left: "92%", anim: "animate-float" },
      ];

  return (
    <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
      {bubbles.map((b, i) => (
        <div
          key={i}
          className={`absolute ${b.anim}`}
          style={{
            width: `${b.size}px`,
            height: `${b.size}px`,
            top: b.top,
            left: b.left,
          }}
        >
          <img
            src={b.src}
            alt=""
            className="w-full h-full opacity-40 blur-sm mix-blend-soft-light"
          />
        </div>
      ))}
    </div>
  );
};
