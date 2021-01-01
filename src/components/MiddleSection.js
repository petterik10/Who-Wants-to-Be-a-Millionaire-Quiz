import React, { useState, useEffect } from "react";
import AskAudience from "./AskAudience";

function MiddleSection({
  call,
  lifeline,
  askAudience,
  audienceCount,
  answer,
  currentMoneyWon,
}) {
  const [timeLeft, setTimeLeft] = useState(25 * 1000);

  useEffect(() => {
    if (call) {
      const newIntervalId = setInterval(() => {
        setTimeLeft((preValue) => {
          if (preValue === 0) return;
          return preValue - 1000;
        });
      }, 1000);
      return () => clearInterval(newIntervalId);
    }
  });

  useEffect(() => {
    if (timeLeft === 0) {
      return;
    }
  }, [timeLeft]);

  const timeConverter = () => {
    let seconds = timeLeft / 1000;
    return `${seconds}`;
  };

  return (
    <div className="middle-container">
      {lifeline === "ask-audience" && askAudience && audienceCount === 1 ? (
        <AskAudience/>
      ) : (
        <div>
          {answer}
          <div className="money">{currentMoneyWon}</div>
          <div
            className="timer"
            style={{
              visibility: call && timeLeft > 1 ? "visible" : "hidden",
            }}
          >
            {timeConverter(timeLeft)}
          </div>
        </div>
      )}
    </div>
  );
}

export default MiddleSection;
