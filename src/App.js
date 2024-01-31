import React, { useState, useEffect } from "react";
import { Container, Button, Card, Alert } from "react-bootstrap";
import questionsData from "./questionsData";

const App = () => {
  const [page, setPage] = useState(0);
  const [answers, setAnswers] = useState(
    Array(questionsData.length).fill(null)
  );
  const [timer, setTimer] = useState(300);
  const [intervalId, setIntervalId] = useState(null);

  const startTimer = () => {
    const id = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);
    setIntervalId(id);
  };

  const stopTimer = () => {
    clearInterval(intervalId);
  };

  const handleStart = () => {
    setPage(1);
    startTimer();
  };

  const handleAnswer = (questionIndex, selectedOption) => {
    setAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers];
      newAnswers[questionIndex] = selectedOption;
      return newAnswers;
    });
  };

  const calculateScore = () => {
    const correctCount = answers.reduce((count, answer, index) => {
      return answer === questionsData[index].correctAnswer ? count + 1 : count;
    }, 0);
    return correctCount;
  };

  const handleFinish = () => {
    stopTimer();
    setPage(2);
  };

  const handleRestart = () => {
    setPage(0);
    setAnswers(Array(questionsData.length).fill(null));
    setTimer(300);
  };

  useEffect(() => {
    if (timer === 0) {
      stopTimer();
      setPage(2);
    }
  }, [timer]);

  return (
    <Container className="mt-5 text-center col-md-6">
      {page === 0 && (
        <div>
          <h2>Welcome to the Python Quiz Test</h2>
          <p style={{ color: "gray" }}>
            Click the button below to start the quiz
          </p>
          <Button variant="primary" onClick={handleStart}>
            Start
          </Button>
        </div>
      )}
      {page === 1 && (
        <div>
          <h4 className="text-end">
            Time: {Math.floor(timer / 60)}:{timer % 60}
          </h4>
          {questionsData.map((q, index) => (
            <Card key={index} className="mt-3">
              <Card.Body>
                <Card.Title>{q.question}</Card.Title>
                {q.options.map((option, optionIndex) => (
                  <Button
                    key={optionIndex}
                    variant={
                      answers[index] === optionIndex
                        ? "primary"
                        : "outline-primary"
                    }
                    className="m-2"
                    onClick={() => handleAnswer(index, optionIndex)}
                  >
                    {option}
                  </Button>
                ))}
              </Card.Body>
            </Card>
          ))}
          <Button
            variant="primary"
            className="mt-3 mb-5"
            onClick={handleFinish}
          >
            Submit
          </Button>
        </div>
      )}
      {page === 2 && (
        <div>
          <h2>Results</h2>
          <Alert
            variant={
              calculateScore() / questionsData.length >= 0.6
                ? "success"
                : "danger"
            }
          >
            Correct Answers: {calculateScore()} / {questionsData.length}
          </Alert>
          {questionsData.map((q, index) => (
            <Card key={index} className="mt-3">
              <Card.Body>
                <Card.Title>{q.question}</Card.Title>
                <div>
                  Your Answer: {q.options[answers[index]]}
                  {answers[index] === q.correctAnswer ? (
                    <span style={{ color: "green", marginLeft: "10px" }}>
                      Correct!
                    </span>
                  ) : (
                    <span style={{ color: "red", marginLeft: "10px" }}>
                      <br />
                      Incorrect! Correct Answer: {q.options[q.correctAnswer]}
                    </span>
                  )}
                </div>
              </Card.Body>
            </Card>
          ))}
          <Button variant="primary" className="mt-3" onClick={handleRestart}>
            Restart
          </Button>
        </div>
      )}
    </Container>
  );
};

export default App;
