import React from 'react';
import Quizcard from '../QuizCard/Quizcard';
import Createquizcard from '../CreateQuizCard/Createquizcard';
import QuizData from "../../data/quiz_Data.json";
import "./Homepage.css";

const HomePage = () => {
  // Assume quizzes is an array of quiz objects
  const quizzes = QuizData;

  const handleViewOptions = (quiz) => {
    // Handle logic for viewing options for the selected quiz
  };

  const handleAddNewQuiz = () => {
    // Handle logic for adding a new quiz
  };

  return (
    <div className="homepage-container">
      <h1 className="homepage-heading">Quizzes</h1>
      <div className="quiz-cards-container">
        {quizzes.map((quiz) => (
          <Quizcard key={quiz.id} quiz={quiz} onViewOptions={handleViewOptions} />
        ))}
      </div>

      <Createquizcard onAddNewQuiz={handleAddNewQuiz} />
    </div>
  );
};

export default HomePage;
