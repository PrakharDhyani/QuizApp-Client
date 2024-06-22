import React from 'react';
import QuizData from "../../data/quiz_Data.json";
import QuizCard from "../../Components/QuizCard/Quizcard"
import CreateQuizButton from "../CreateQuizPage/Createquizpage"
import { useNavigate } from 'react-router-dom';
import "./Homepage.css"
import Header from '../../Components/Header/Header';




const HomePage = () => {
  const navigate = useNavigate();
  const handleCreateQuiz = ()=>{
      navigate("/quiz/create")
  }

  const quizzes = QuizData
  return (
    <div className="homepage">
      <Header/>
      <main className="main-content">
        <div className="quiz-cards">
          {quizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}

          <div className='quiz-card'  onClick={handleCreateQuiz} >
            + Createquiz 
        </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
