import React from "react";

function LifeLines(props) {
  return (
    <button
      onClick={() => props.lifeline(props.name)}
      className={props.class}
      style={{
        backgroundImage: props.state
          ? `url(${props.another})`
          : `url(${props.image})`,
      }}
    >
      <span className="tooltiptext">{props.text}</span>
    </button>
  );
}

export default LifeLines;
