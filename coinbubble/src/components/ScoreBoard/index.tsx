"use client";

import React, { useEffect, useState } from "react";
import "./style.scss";
import { ScoringSystem } from "~/lib/functions";
import { randomCreators } from "~/Services/creator";

interface ScoreBoardProps {
  onClose: () => void;
  onHome: () => void;
  onShare: () => void;
  onReplay: () => void;
  scoringSystem: ScoringSystem;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  onClose,
  onHome,
  onShare,
  onReplay,
  scoringSystem,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger fade-in animation after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  const handleHome = () => {
    setIsVisible(false);
    setTimeout(() => {
      onHome();
    }, 100);
  };

  const handleShare = () => {
    onShare();
  };

  const handleReplay = () => {
    console.log("Replay button clicked in ScoreBoard");
    setIsVisible(false);
    setTimeout(() => {
      console.log("Calling onReplay function");
      onReplay();
    }, 300);
  };

  const filterCoins = Object.values(
    scoringSystem
      .getCreatorBubblesPopped()
      .reduce(
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
  );
  return (
    <div className={`scoreboard-container ${isVisible ? "visible" : ""}`}>
      <div className="blur-background"></div>
      <div className="scoreboard">
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
            <div
              className="info-content"
              style={{
                marginTop: filterCoins.length > 2 ? "100px" : "120px",
              }}
            >
              {/* Score Section */}
              <div className="score-section">
                <span className="label">Your Score : </span>
                <span className="value">
                  {scoringSystem.getStats().totalPoints}
                </span>
              </div>
              {/* Creator Coin Section */}
              <div className="creator-coin-section">
                <span className="label">Creator coin: </span>
                <img
                  src="/assets/score_board/Coin.png"
                  alt="coin"
                  className="coin-icon inline"
                />
                <span className="value">{filterCoins.length}</span>
              </div>
              {/* Coin Grid */}
              <div className="coin-grid">
                <div className="grid-label">Value : </div>
                <div className="coin-values">
                  {filterCoins.slice(0, 2).map((creator, index) => {
                    const creatorData = randomCreators.find(
                      (item) =>
                        item.coinAddress.toLowerCase() ===
                        creator.creatorPfp.toLowerCase()
                    );

                    return (
                      <div key={index} className="coin-item">
                        <div className="coin-value-row">
                          <img
                            src={creatorData?.pfp}
                            alt={creator.creatorPfp}
                            className="coin-icon"
                          />
                          <div className="coin-amount">
                            {creator.points * 100}
                          </div>
                        </div>
                        <div className="coin-name">
                          {creatorData?.displayName}
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
              <button
                className="action-button-wrapper"
                onClick={handleHome}
                aria-label="Go Home"
              >
                <img
                  src="/assets/score_board/Home.svg"
                  alt="home"
                  className="action-button"
                />
              </button>
              <button
                className="action-button-wrapper"
                onClick={handleReplay}
                aria-label="Replay Game"
              >
                <img
                  src="/assets/score_board/Replay.svg"
                  alt="replay"
                  className="action-button"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
