import React from 'react';

const QuizDetails = ({ quiz, startQuiz }) => {
  return (
    <div className="quiz-details">
      <h1>{quiz.title}</h1>
      <p>Number of questions: {quiz.numberOfQuestions}</p>
      <button onClick={startQuiz}>Start Quiz</button>
    </div>
  );
};

export default QuizDetails;
