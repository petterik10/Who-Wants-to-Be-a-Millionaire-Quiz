import React, { useState, useEffect } from "react";
import Questionvalue from "./Questionvalue";
import Options from "./Options";
import MiddleSection from "./MiddleSection";
import { setFiftyFifty, removeClass } from "../script";
import Lifelines from "./Lifelines";
import he from "he";

function App() {
  const [million, setMillion] = useState({
    question: "",
    options: ["", "", "", ""],
  });

  const [questions, setQuestions] = useState([]);
  const [clickedAnswer, setClickedAnswer] = useState("");
  const [questionCount, setQuestionCount] = useState(1);
  const [rightAnswer, setRightAnswer] = useState("");
  const [fiftyFiftyLifeline, setFiftyFiftyLifeline] = useState(false);
  const [callLifeline, setTheCall] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 1000);
  const [money, setMoney] = useState("$100");
  const [answer, setAnswer] = useState("");
  const [keyPress, setKeyPress] = useState(false);
  const [askAudience, setAskAudience] = useState(false);

  useEffect(() => {
    if (!keyPress) {
      fetch("https://opentdb.com/api.php?amount=16&type=multiple")
        .then((res) => res.json())
        .then((res) => {
          const correctAnswer = res.results[0].correct_answer;
          console.log(correctAnswer);
          setRightAnswer(he.decode(correctAnswer));
          setMoney("$100");
          setAnswer("");
          setFiftyFiftyLifeline(false);
          setAskAudience(false);
          setTheCall(false);
          const incorrectAnswers = res.results[0].incorrect_answers;
          const options = [...incorrectAnswers, correctAnswer]
            .map((elem) => {
              return he.decode(elem);
            })
            .sort(() => Math.random() - 0.5);
          setQuestions(res.results);
          setMillion({
            question: he.decode(res.results[0].question),
            options: options,
          });
        });
    }
    if (keyPress) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [keyPress]);

  useEffect(() => {
    if (fiftyFiftyLifeline) {
      document.getElementsByClassName("fifty-fifty")[0].style.backgroundImage =
        "url('https://vignette.wikia.nocookie.net/millionaire/images/1/1e/Classic5050used.png/revision/latest?cb=20160407180240')";
    } else {
      document.getElementsByClassName("fifty-fifty")[0].style.backgroundImage =
        "url('https://vignette.wikia.nocookie.net/millionaire/images/7/73/Classic5050.png/revision/latest?cb=20160407180209')";
    }
  }, [fiftyFiftyLifeline]);

  useEffect(() => {
    if (questionCount === 16) return;
    const value = document.getElementsByClassName("questionvalue")[0];
    value.children[
      value.children.length - questionCount
    ].style.backgroundColor = "blue";
    setMoney(
      `${value.children[value.children.length - questionCount].textContent}`
    );
    return () => {
      value.children[
        value.children.length - questionCount
      ].style.backgroundColor = "";
    };
  }, [million]);

  useEffect(() => {
    if (askAudience) {
      setMoney("");
      document
        .getElementsByClassName("middle-container")[0]
        .classList.add("ask-audience-picture");
      document.getElementsByClassName("ask-audience")[0].style.backgroundImage =
        "url('https://vignette.wikia.nocookie.net/millionaire/images/9/97/ClassicATAused.png/revision/latest/scale-to-width-down/150?cb=20160407180750')";
    } else {
      document.getElementsByClassName("ask-audience")[0].style.backgroundImage =
        "url('https://vignette.wikia.nocookie.net/millionaire/images/c/c6/ClassicATA.png/revision/latest?cb=20160407180412')";
    }
    return () => {
      document
        .getElementsByClassName("middle-container")[0]
        .classList.remove("ask-audience-picture");
    };
  }, [askAudience]);

  const handleKeyDown = () => {
    setKeyPress(false);
    setQuestionCount(1);
    setTheCall(false);
    setTimeLeft(30 * 1000);
  };

  const handleFiftyFifty = () => {
    if (!fiftyFiftyLifeline) {
      const fiftyFiftyOptions = setFiftyFifty(million.options, rightAnswer);
      setMillion((preValue) => {
        return {
          ...preValue,
          options: fiftyFiftyOptions,
        };
      });
      setFiftyFiftyLifeline(true);
    }
  };

  const handleClickAnswer = (clickedOption) => {
    setClickedAnswer(clickedOption);
  };

  const newQuestion = () => {
    if (questionCount === 15) {
      setAnswer("Congratulations, You made it!, Press any key to restart");
      setKeyPress(true);
      setMillion({ question: "", options: ["", "", "", ""] });
      setMoney("");
      return;
    } else {
      const correctAnswer = he.decode(questions[questionCount].correct_answer);
      console.log(correctAnswer);
      setRightAnswer(he.decode(questions[questionCount].correct_answer));
      const incorrectAnswers = questions[questionCount].incorrect_answers;
      const newQuestions = [...incorrectAnswers, correctAnswer].map((elem) => {
        return he.decode(elem);
      });
      setMillion({
        question: he.decode(questions[questionCount].question),
        options: newQuestions.sort(() => Math.random() - 0.5),
      });
      setAnswer("");
    }
  };

  const showResult = () => {
    if (askAudience) {
      removeClass();
    }
    setAnswer("That was correct");
    const options = document.getElementsByClassName("option-flex")[0];
    for (let i = 0; i < options.children.length; i++) {
      if (options.children[i].textContent === rightAnswer) {
        options.children[i].style.backgroundColor = "green";
      }
    }
  };

  const showTheCorrectAnswer = () => {
    if (askAudience) {
      removeClass();
    }
    const templateAnswer = `That was incorrect. Press any key to restart`;
    const options = document.getElementsByClassName("option-flex")[0];
    for (let i = 0; i < options.children.length; i++) {
      if (options.children[i].textContent === rightAnswer) {
        options.children[i].style.backgroundColor = "green";
      }
      if (options.children[i].style.backgroundColor === "orange") {
        options.children[i].style.backgroundColor = "red";
      }
    }
    setAnswer(templateAnswer);
    setKeyPress(true);
    setMoney("");
  };

  const checkAnswer = () => {
    if (clickedAnswer === rightAnswer) {
      setTimeout(showResult, 2000);
      setQuestionCount(questionCount + 1);
      setTimeout(newQuestion, 4000);
    } else {
      setTimeout(showTheCorrectAnswer, 2000);
    }
  };

  const handleCall = () => {
    setTheCall(true);
  };

  const askTheAudience = () => {
    setAskAudience(true);
  };

  return (
    <>
      <div>
        <div className="flex-container">
          <div className="btn">
            <Lifelines class="fifty-fifty" lifeLine={handleFiftyFifty} />
            <Lifelines class="ask-audience" lifeLine={askTheAudience} />
            <Lifelines class="call-friend" lifeLine={handleCall} />
            <Lifelines
              class="check"
              lifeLine={checkAnswer}
              text="Check the answer"
            />
          </div>
          <MiddleSection
            answer={answer}
            currentMoneyWon={money}
            timeLeft={timeLeft}
            call={callLifeline}
            timer={setTimeLeft}
          />
          <Questionvalue />
        </div>
        <Options
          millionQuestion={million.question}
          handleClickAnswer={handleClickAnswer}
          newMillionQuestion={million}
        />
      </div>
    </>
  );
}

export default App;
