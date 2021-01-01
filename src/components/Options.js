import React from "react";

function Options(props) {
  return (
    <div className="option-container">
      <div className="question">{props.millionQuestion}</div>
      <div className="option-flex">
        {props.newMillionQuestion.map((option, index) => {
          return (
            <div
              key={index}
              style={{
                backgroundColor:
                  props.showRightAnswer && props.clickedAnswer === option
                    ? "green"
                    : props.setItwasNotCorrect && props.correctAnswer === option
                    ? "green"
                    : props.setItwasNotCorrect && props.clickedAnswer === option
                    ? "red"
                    : !option
                    ? ""
                    : props.clickedAnswer === option
                    ? "orange"
                    : "",
              }}
              onClick={() => props.handleClickedAnswer(option)}
            >
              {option}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Options;