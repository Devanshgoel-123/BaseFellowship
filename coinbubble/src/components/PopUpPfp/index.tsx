import React from "react";
import "./styles.scss";
import Image from "next/image";

interface GoldenBubbleProps {
  pfpSrc: string;
  message?: string;
}

export const GoldenBubblePopup = ({ pfpSrc, message }: GoldenBubbleProps) => {
  return (
    <div className="goldenBubbleOverlay">
      <div className="goldenBubblePopup">
        <Image
          src={pfpSrc || "/assets/bubbles/bubble2.png"}
          alt="creator"
          width={120}
          height={120}
          className="goldenBubbleImage"
        />
        <p className="message">{message}</p>
      </div>
    </div>
  );
};

// JESSE TOKEN 0x0181fe1d1448b57c95bc863BEEb464c3EBe6DF5A
// SAXENA TOKEN 0xfc511D406B9C2088196739658cBe33328317a97a
// SHUKLA TOKEN 0xF7b160256b99f81B738D70c4B588DE7E1BBD9b32
// AYMAN TOKEN 0x02338f1Fd087Cf05912157ff1bD559b8b26A4b12