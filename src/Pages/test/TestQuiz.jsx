import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../Common/apis';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';

import './Quizpage.css';

function TestQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  
  const [timer, setTimer] = useState(10);
  const [showAnswer, setShowAnswer] = useState(false);
  const [question,setQuestion] = useState({});
  const [animationUrl,setAnimationUrl] = useState(null)
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await api.get(`/quizzes/${id}`);
        console.log(response.data.quiz)
        setQuiz(response.data.quiz);
        setQuestion(response.data.quiz.questions[0])
        setAnimationUrl(Object.values(response.data.quiz.questions[0].backgroundAnimations)[0]);

      } catch (error) {
        console.error('Error fetching quiz:', error);
      }
    };

    fetchQuiz();
  }, [id]);


  if (!quiz) return <div>Loading...</div>;

  return (
    <div className="question-slide full-screen-media">
      <video src={animationUrl} autoPlay loop muted className="background-video" />
      <div className="question-section">
        <div className="question-header">
          <div className="question-number">{Math.floor(currentSlideIndex / 2) + 1}</div>
          <div className="question-text">{question?.questionText}</div>
        </div>
        <div className="question-body">
          <img 
            src={showAnswer ? question?.answerPhotoUrl : question?.questionPhotoUrl} 
            alt="Question" 
            className="question-image img-animation" 
          />
          <div className="options">
            {question?.options?.map((option, index) => (
              <div
                key={index}
                className={`option-${index+1}  option ${showAnswer && option === question?.correctAnswer ? 'correct' : ''}`}
              >
                <span className="option-label">{String.fromCharCode(97 + index)}</span>
                {option}
              </div>
            ))}
          </div>
        </div>
        <div className="timer-container">
          <div className='timer-bar-container'>
            <div 
                className={`timer-bar ${timer <= 3 ? 'urgent' : ''}`} 
                style={{ width: `${(timer / 10) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestQuiz;
