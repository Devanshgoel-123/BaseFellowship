"use client";
import React from 'react';
import './style.scss';

interface StartScreenProps {
  onStart: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const handleStart = () => {
    onStart();
  };

  return (
    <div className="start-screen">
      {/* Top Roll */}
      <img
        src="/assets/start_screen/Roll_top.png"
        className="top-roll"
        alt="Top Roll"
      />
      {/* Level */}
      <img
        src="/assets/start_screen/Level.png"
        className="level"
        alt="Level"
      />

      <div className="content-container">
        {/* base */}
        <img
          src="/assets/start_screen/Roll.png"
          className="base-roll"
          alt="Start Screen base"
        />
        {/* Avatars */}
        <img
          src="/assets/start_screen/avatars.png"
          className="avatars"
          alt="Avatars"
        />
        {/* Texts */}
        <div className="text-container">
          <div className="title">Play & Earn</div>
          <div className="description">
            Hit the <span className="bold">golden balls</span> to <span className="bold">earn creator coins</span>
          </div>
        </div>
        {/* Start Button */}
        <button 
          className="start-button-wrapper"
          onClick={handleStart}
          aria-label="Start Game"
        >
          <img
            src="/assets/start_screen/Start-button.png"
            className="start-button"
            alt="Start Button"
          />
        </button>
      </div>
    </div>
  )
}
