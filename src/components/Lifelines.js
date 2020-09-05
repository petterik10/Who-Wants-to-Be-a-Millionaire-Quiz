import React from "react";

function LifeLines(props) {
  return <button className={props.class} onClick={props.lifeLine}>
    <span className="tooltiptext">{props.text}</span>
  </button>;
}

export default LifeLines;
