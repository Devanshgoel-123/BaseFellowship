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
        <p className="message">You earned saxsena sahib coin</p>
      </div>
    </div>
  );
};
