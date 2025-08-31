"use client";

import React, { useEffect, useState } from 'react';
import './style.scss';
import { ScoringSystem } from '~/lib/functions';
import { useGameStore } from '~/store/gameStats';
import { randomCreators } from '~/Services/creator';

interface ScoreBoardProps {
  onClose: () => void;
  onHome: () => void;
  onShare: () => void;
  onReplay: () => void;
  scoringSystem: ScoringSystem;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ onClose, onHome, onShare, onReplay, scoringSystem }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger fade-in animation after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // Wait for fade-out animation
  };

  const handleHome = () => {
    setIsVisible(false);
    setTimeout(() => {
      onHome();
    }, 300);
  };

  const handleShare = () => {
    onShare();
  };

  const handleReplay = () => {
    setIsVisible(false);
    setTimeout(() => {
      onReplay();
    }, 300);
  };

  return (
    <div className={`scoreboard-container ${isVisible ? 'visible' : ''}`}>
      <div className="blur-background"></div>
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
                <span className="value">{scoringSystem.getStats().totalPoints}</span>
              </div>
              {/* Creator Coin Section */}
              <div className="creator-coin-section">
                <span className="label">Creator coin: </span>
                <img
                  src="/assets/score_board/Coin.png"
                  alt="coin"
                  className="coin-icon inline"
                />
                <span className="value">{scoringSystem.getCreatorBubblesPopped().length}</span>
              </div>
              {/* Coin Grid */}
              <div className="coin-grid">
                <div className="grid-label">Value</div>
                <div className="coin-values">
                  {Object.values(
                    scoringSystem.getCreatorBubblesPopped().reduce(
                      (acc: Record<string, { creatorPfp: string; points: number }>, item) => {
                        const key = item.creatorPfp.toLowerCase();
                        if (!acc[key]) {
                          acc[key] = { creatorPfp: item.creatorPfp, points: 0 };
                        }
                        acc[key].points += item.points;
                        return acc;
                      },
                      {}
                    )
                  ).map((creator, index) => {
                    const creatorPfp = randomCreators.find(
                      (item) => item.coinAddress.toLowerCase() === creator.creatorPfp.toLowerCase()
                    )?.pfp;

                    return (
                      <div key={index} className="coin-item">
                        <div className="coin-value-row">
                          <img
                            src={creatorPfp}
                            alt={creator.creatorPfp}
                            className="coin-icon"
                          />
                          <div className="coin-amount">
                            {creator.points * 100}
                          </div>
                        </div>
                      </div>
                    );
                  })}
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
    </div>
  );
};

export default ScoreBoard;