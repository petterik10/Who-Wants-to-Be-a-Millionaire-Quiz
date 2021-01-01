import React from "react";

export default function CheckAnswer({ checkAnswer }) {
  return (
    <button onClick={() => checkAnswer()} className="check">
      <span className="tooltiptext"></span>
    </button>
  );
}