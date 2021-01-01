import React, { useEffect } from "react";

function Questionvalue({ questionCount, dispatch }) {
  const questionValue = [
    "1 Million",
    "$500 000",
    "$250 000",
    "$125 000",
    "$65 000",
    "$32 000",
    "$16 000",
    "$8000",
    "$4000",
    "$2000",
    "$1000",
    "$500",
    "$300",
    "$200",
    "$100",
  ];
  useEffect(() => {
    dispatch({
      type: "showMoney",
      payload: {
        currentMoneyWon: questionValue[questionValue.length - questionCount],
      },
    });
  }, [questionCount]);

  return (
    <>
      <div className="questionvalue">
        {questionValue.map((sum, index) => {
          return (
            <p
              style={{
                backgroundColor:
                  index === questionValue.length - questionCount ? "blue" : "",
              }}
              key={index}
            >
              {sum}
            </p>
          );
        })}
      </div>
    </>
  );
}

export default Questionvalue;
