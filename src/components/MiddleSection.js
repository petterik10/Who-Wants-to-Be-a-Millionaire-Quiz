import React, { useEffect } from "react";

function MiddleSection(props) {
  useEffect(() => {
    if (props.timeLeft === 0) {
      removeTimer();
    }
  }, [props.timeLeft]);

  useEffect(() => {
    if (props.call) {
      document.getElementsByClassName("call-friend")[0].style.backgroundImage =
        "url('https://vignette.wikia.nocookie.net/millionaire/images/4/4a/ClassicPAFused.png/revision/latest/top-crop/width/300/height/300?cb=20160407180838')";
      const newIntervalId = setInterval(() => {
        props.timer((preValue) => {
          if (preValue === 0) return;
          return preValue - 1000;
        });
      }, 1000);
      return () => clearInterval(newIntervalId);
    } else {
      document.getElementsByClassName("call-friend")[0].style.backgroundImage =
        "url('https://vignette.wikia.nocookie.net/millionaire/images/8/88/ClassicPAF.png/revision/latest?cb=20160407180816')";
    }
  });

  function removeTimer() {
    const timer = document.getElementsByClassName("timer")[0];
    timer.style.visibility = "hidden";
  }
  const timeConverter = () => {
    let seconds = props.timeLeft / 1000;
    return `${seconds}`;
  };
  return (
    <div className="middle-container">
      {props.answer}
      <div className="money">{props.currentMoneyWon}</div>
      <div
        className="timer"
        style={{ visibility: props.call ? "visible" : "hidden" }}
      >
        {" "}
        {timeConverter(props.timeLeft)}
      </div>
    </div>
  );
}

export default MiddleSection;
