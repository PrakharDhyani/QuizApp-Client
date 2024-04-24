import React from 'react';
import logo from '/assets/logo.png'
import QuizData from "../../data/quiz_Data.json";
import QuizCard from "../QuizCard/Quizcard"
import CreateQuizButton from "../CreateQuizCard/Createquizcard"
import "./Homepage.css"


const HomePage = () => {
  const quizzes = QuizData
  return (
    <div className="homepage">
      <header className="header">
          <img src={logo} alt="Logo" className="logo" />
          <h1 className="title">Quiz Mastery</h1> 
      </header>

      <main className="main-content">
        <div className="quiz-cards">
          {quizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        <CreateQuizButton />
        </div>
      </main>
    </div>
  );
};

export default HomePage;
