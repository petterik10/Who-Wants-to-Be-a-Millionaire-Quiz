import React, { useState, useEffect } from "react";

function Options(props) {
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    setClicked(false);
    const millionChildren = document.getElementsByClassName("option-flex")[0];
    for (let i = 0; i < millionChildren.children.length; i++) {
      millionChildren.children[i].style.backgroundColor = "";
    }
    return () => {
      for (let i = 0; i < millionChildren.children.length; i++) {
        millionChildren.children[i].style.backgroundColor = "";
      }
    };
  }, [props.newMillionQuestion]);

  const handleClickedOption = (event) => {
    props.handleClickAnswer(event.target.textContent);
    const color = "orange";
    if (!clicked) {
      event.target.style.background = `${color}`;
      setClicked(true);
    } else if (clicked && event.target.style.background === `${color}`) {
      event.target.style.background = "";
      setClicked(false);
    }
  };

  return (
    <div className="option-container">
      <div className="question">{props.millionQuestion}</div>
      <div className="option-flex">
        {props.newMillionQuestion.options.map((option, index) => {
          return (
            <div
              dangerouslySetInnerHTML={{ __html: option }}
              onClick={handleClickedOption}
              key={index}
            ></div>
          );
        })}
      </div>
    </div>
  );
}

export default Options;
