"use client";

import React from 'react';
import './style.scss';

interface ScoreBoardProps {
  onClose: () => void;
  onHome: () => void;
  onShare: () => void;
  onReplay: () => void;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ onClose, onHome, onShare, onReplay }) => {

  const handleClose = () => {
    onClose();
  };

  const handleHome = () => {
    onHome();
  };

  const handleShare = () => {
    onShare();
  };

  const handleReplay = () => {
    onReplay();
  };

  return (
    <div className="scoreboard">
      {/* close button */}
      <img
        src="/assets/score_board/Close.svg"
        className="close-button"
        onClick={handleClose}
        alt="Close button"
      />
      {/* Roll Top */}
      <img
        src="/assets/score_board/Roll_top.png"
        className="roll-top"
        alt="Roll top decoration"
      />
      {/* Level */}
      <img
        src="/assets/score_board/Level.png"
        className="level"
        alt="Level indicator"
      />

      {/* Roll Bottom */}
      <img
        src="/assets/score_board/Roll_bottom.png"
        className="roll-bottom"
        alt="Roll bottom decoration"
      />

      <div className="content-container">
        {/* Base SVG */}
        <img
          src="/assets/score_board/Roll.png"
          className="base-roll"
          alt="Score board background"
        />

        {/* Stars */}
        <img
          src="/assets/score_board/Stars_3.svg"
          className="stars"
          alt="Three stars rating"
        />

        {/* Information Area */}
        <div className="info-area">
          <div className="info-content">
            {/* Score Section */}
            <div className="score-section">
              <span className="label">Your Score: </span>
              <span className="value">48552</span>
            </div>

            {/* Creator Coin Section */}
            <div className="creator-coin-section">
              <span className="label">Creator coin: </span>
              <img
                src="/assets/score_board/Coin.png"
                alt="coin"
                className="coin-icon inline"
              />
              <span className="value">2</span>
            </div>

            {/* Coin Grid */}
            <div className="coin-grid">
              <div className="grid-label">Value</div>
              <div className="coin-values">
                {/* First Row */}
                <div className="coin-item">
                  <div className="coin-value-row">
                    <img
                      src="/assets/score_board/Coin.png"
                      alt="coin"
                      className="coin-icon"
                    />
                    <div className="coin-amount">0.001</div>
                  </div>
                  <div className="coin-name">Pratzy</div>
                </div>

                <div className="coin-item">
                  <div className="coin-value-row">
                    <img
                      src="/assets/score_board/Coin.png"
                      alt="coin"
                      className="coin-icon"
                    />
                    <div className="coin-amount">0.003</div>
                  </div>
                  <div className="coin-name">Ayman</div>
                </div>

                {/* Second Row */}
                <div className="coin-item">
                  <div className="coin-value-row">
                    <img
                      src="/assets/score_board/Coin.png"
                      alt="coin"
                      className="coin-icon"
                    />
                    <div className="coin-amount">0.005</div>
                  </div>
                  <div className="coin-name">Jesse.wtv</div>
                </div>

                <div className="coin-item">
                  <div className="coin-value-row">
                    <img
                      src="/assets/score_board/Coin.png"
                      alt="coin"
                      className="coin-icon"
                    />
                    <div className="coin-amount">0.001</div>
                  </div>
                  <div className="coin-name">Ratnakar.etf</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* buttons section */}
        <div className="buttons-section">
          <div className="buttons-container"> 
            <img
              src="/assets/score_board/Home.svg"
              alt="home"
              className="action-button"
              onClick={handleHome}
            />
            <img
              src="/assets/score_board/Share.svg"
              alt="share"
              className="action-button"
              onClick={handleShare}
            />
            <img
              src="/assets/score_board/Replay.svg"
              alt="replay"
              className="action-button"
              onClick={handleReplay}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScoreBoard;
