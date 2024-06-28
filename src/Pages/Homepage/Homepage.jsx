import React, { useEffect, useState } from 'react';
import QuizCard from "../../Components/QuizCard/Quizcard";
import { useNavigate } from 'react-router-dom';
import Header from '../../Components/Header/Header';
import api from '../../Common/apis';

import "./Homepage.css";

const HomePage = () => {
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await api.get("/quizzes");
        console.log(response.data.quizzes);
        setQuizData(response.data.quizzes);
      } catch (error) {
        console.log(error);
      }
    };

    fetchQuizzes();
  }, []);

  const handleCreateQuiz = () => {
    navigate("/quiz/create");
  }

  return (
    <div className="homepage">
      <Header />
      <main className="main-content">
        <div className="quiz-cards">
          {quizData && quizData.map((quiz) => (
            <QuizCard key={quiz._id} quiz={quiz} />
          ))} 
          
          <div className='quiz-card create-quiz-card' onClick={handleCreateQuiz}>
            + Create Quiz
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
