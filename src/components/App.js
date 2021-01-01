import React, { useEffect, useReducer } from "react";
import Questionvalue from "./Questionvalue";
import Options from "./Options";
import MiddleSection from "./MiddleSection";
import CheckAnswer from "./CheckAnswer";
import { setFiftyFifty } from "../script";
import Lifelines from "./Lifelines";
import he from "he";

function reducer(state, action) {
  switch (action.type) {
    case "firstLoad": {
      return {
        ...state,
        rightAnswer: he.decode(action.payload.correctAnswer),
        money: "$100",
        answer: "",
        clickedAnsw: "",
        keyPress: true,
        fiftyFiftyLifeline: false,
        callLifeline: false,
        callaskAudienceCount: 0,
        callFriendCount: 0,
        questions: [...action.payload.questions],
        million: {
          question: he.decode(action.payload.million),
          options: [...action.payload.options],
        },
        askTheAudience: false,
        lifeline: "",
        showRightAnswer: false,
        setItWasNotCorrect: false,
      };
    }
    case "clickedAnswer": {
      return {
        ...state,
        clickedAnsw: action.payload.clickedAnswer,
      };
    }
    case "showResult": {
      return {
        ...state,
        answer: "That was correct",
        showRightAnswer: true,
        lifeline: "",
      };
    }

    case "setItWasNotCorrect": {
      return {
        ...state,
        setItWasNotCorrect: true,
        answer: "That was incorrect. Press any key to restart",
        money: "",
        keyPress: true,
        lifeline: "",
      };
    }
    case "newQuestion": {
      const correctAnswer = he.decode(
        state.questions[state.questionCount].correct_answer
      );
      const incorrectAnswers =
        state.questions[state.questionCount].incorrect_answers;
      const newQuestions = [...incorrectAnswers, correctAnswer].map((elem) => {
        return he.decode(elem);
      });
      return {
        ...state,
        questionCount: state.questionCount + 1,
        rightAnswer: correctAnswer,
        answer: "",
        lifeline: "",
        showRightAnswer: false,
        million: {
          question: he.decode(state.questions[state.questionCount].question),
          options: newQuestions.sort(() => Math.random() - 0.5),
        },
      };
    }

    case "showMoney": {
      return {
        ...state,
        money: action.payload.currentMoneyWon,
      };
    }

    case "gameOver": {
      const templateAnswer = `That was incorrect. Press any key to restart`;
      return {
        ...state,
        answer: templateAnswer,
        money: "",
        keyPress: true,
      };
    }
    case "KeyDown": {
      return {
        ...state,
        keyPress: false,
        questionCount: 1,
      };
    }

    case "FiftyFiftytoTrue": {
      return {
        ...state,
        fiftyFiftyLifeline: true,
      };
    }

    case "FiftyFifty": {
      return {
        ...state,
        million: {
          question: action.payload.question,
          options: action.payload.fiftyfifty,
        },
      };
    }

    case "AskAudience": {
      return {
        ...state,
        askTheAudience: true,
        lifeline: action.payload.askAudience,
      };
    }

    case "CallFriend": {
      return {
        ...state,
        callLifeline: true,
      };
    }
    case "CallFriendToFalse": {
      return {
        ...state,
        callLifeline: false,
      };
    }
    case "Winner": {
      return {
        answer: "Congratulations, You made it!, Press any key to restart",
        keyPress: true,
        million: { question: "", options: [] },
        money: "",
      };
    }
    default:
      return state;
  }
}

const initialState = {
  million: { question: "", options: [] },
  clickedAnswer: "",
  questionCount: 1,
  rightAnswer: "",
  fiftyFiftyLifeline: false,
  callLifeline: false,
  timeLeft: 30 * 1000,
  callaskAudienceCount: 0,
  callFriendCount: 0,
  money: "100",
  answer: "",
  keyPress: false,
  askTheAudience: false,
  questions: [],
  lifeline: "",
  showRightAnswer: false,
  setItWasNotCorrect: false,
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!state.keyPress) {
      fetch("https://opentdb.com/api.php?amount=16&type=multiple")
        .then((res) => res.json())
        .then((res) => {
          const correctAnswer = res.results[0].correct_answer;
          //console.log(correctAnswer)
          const incorrectAnswers = res.results[0].incorrect_answers;
          const options = [...incorrectAnswers, correctAnswer]
            .map((elem) => {
              return he.decode(elem);
            })
            .sort(() => Math.random() - 0.5);
          const allTheQuestions = res.results;
          dispatch({
            type: "firstLoad",
            payload: {
              correctAnswer: correctAnswer,
              questions: allTheQuestions,
              million: allTheQuestions[0].question,
              options: options,
            },
          });
        });
    }
    if (state.keyPress) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [state.keyPress]);

  useEffect(() => {
    if (state.fiftyFiftyLifeline) {
      const fiftyFiftyOptions = setFiftyFifty(
        state.million.options,
        state.rightAnswer
      );
      dispatch({
        type: "FiftyFifty",
        payload: {
          fiftyfifty: fiftyFiftyOptions,
          question: state.million.question,
        },
      });
    }
  }, [state.fiftyFiftyLifeline]);

  const handleKeyDown = () => {
    dispatch({ type: "KeyDown" });
  };

  const handleFiftyFifty = () => {
    dispatch({ type: "FiftyFiftytoTrue" });
  };

  const handleClickedAnswer = (clickedOption) => {
    dispatch({
      type: "clickedAnswer",
      payload: {
        clickedAnswer: clickedOption,
      },
    });
  };

  const newQuestion = () => {
    if (state.questionCount === 15) {
      dispatch({ type: "Winner" });
    } else {
      dispatch({
        type: "newQuestion",
      });
    }
  };

  const showResult = () => {
    dispatch({ type: "showResult" });
  };

  const showTheCorrectAnswer = () => {
    dispatch({ type: "setItWasNotCorrect" });
  };

  const checkAnswer = () => {
    if (state.clickedAnsw === state.rightAnswer) {
      console.log("Hello");
      setTimeout(showResult, 2000);
      setTimeout(newQuestion, 4000);
    } else {
      setTimeout(showTheCorrectAnswer, 2000);
    }
  };

  const handleCallFriend = () => {
    dispatch({
      type: "CallFriend",
      payload: {
        count: state.callFriendCount++,
      },
    });
  };

  const handleLifeLine = (lifeline) => {
    dispatch({
      type: "AskAudience",
      payload: {
        askAudience: lifeline,
        count: state.callaskAudienceCount++,
      },
    });
  };

  return (
    <>
      <div>
        <div className="flex-container">
          <div className="btn">
            <Lifelines
              class="fifty-fifty"
              name="fifty-fifty"
              lifeline={handleFiftyFifty}
              state={state.fiftyFiftyLifeline}
              image="https://vignette.wikia.nocookie.net/millionaire/images/7/73/Classic5050.png/revision/latest?cb=20160407180209"
              another="https://vignette.wikia.nocookie.net/millionaire/images/1/1e/Classic5050used.png/revision/latest?cb=20160407180240"
            />
            <Lifelines
              class="ask-audience"
              name="ask-audience"
              state={state.askTheAudience}
              lifeline={handleLifeLine}
              image="https://vignette.wikia.nocookie.net/millionaire/images/c/c6/ClassicATA.png/revision/latest?cb=20160407180412"
              another="https://vignette.wikia.nocookie.net/millionaire/images/9/97/ClassicATAused.png/revision/latest/scale-to-width-down/150?cb=20160407180750"
            />

            <Lifelines
              class="call-friend"
              name="call-friend"
              lifeline={handleCallFriend}
              state={state.callLifeline}
              image="https://vignette.wikia.nocookie.net/millionaire/images/8/88/ClassicPAF.png/revision/latest?cb=20160407180816"
              another="https://vignette.wikia.nocookie.net/millionaire/images/4/4a/ClassicPAFused.png/revision/latest/top-crop/width/300/height/300?cb=20160407180838"
            />

            <CheckAnswer checkAnswer={checkAnswer} />
          </div>

          <MiddleSection
            answer={state.answer}
            currentMoneyWon={state.money}
            call={state.callLifeline}
            audienceCount={state.callaskAudienceCount}
            lifeline={state.lifeline}
            askAudience={state.askTheAudience}
            callCount={state.callFriendCount}
          />
          <Questionvalue
            questionCount={state.questionCount}
            dispatch={dispatch}
          />
        </div>
        <Options
          millionQuestion={state.million.question}
          handleClickedAnswer={handleClickedAnswer}
          newMillionQuestion={state.million.options}
          clickedAnswer={state.clickedAnsw}
          showRightAnswer={state.showRightAnswer}
          setItwasNotCorrect={state.setItWasNotCorrect}
          correctAnswer={state.rightAnswer}
        />
      </div>
    </>
  );
}

export default App;
