import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../Common/apis';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';

import './Quizpage.css';

function Quizpage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [timer, setTimer] = useState(10);
  const [showAnswer, setShowAnswer] = useState(false);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const handle = useFullScreenHandle();
  const timerRef = useRef(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await api.get(`/quizzes/${id}`);
        setQuiz(response.data.quiz);
      } catch (error) {
        console.error('Error fetching quiz:', error);
      }
    };

    fetchQuiz();
  }, [id]);

  useEffect(() => {
    if (isQuizStarted) {
      timerRef.current = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer === 1) {
            setShowAnswer(true);
            setTimeout(nextSlide, 3000); // Show the answer for 3 seconds before moving to the next slide
            return 10;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(timerRef.current);
    };
  }, [isQuizStarted]);

  const startScreenRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: 'screen' }
      });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        const url = URL.createObjectURL(event.data);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'recorded-quiz.webm';
        a.click();
      };

      mediaRecorder.start();
    } catch (error) {
      console.error('Error starting screen recording:', error);
      alert('Permission to record screen denied. Please allow screen recording to proceed.');
    }
  };

  const startQuiz = async () => {
    await startScreenRecording();
    await handle.enter();
    setIsQuizStarted(true);
  };

  const stopScreenRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const handleExitFullscreen = () => {
    stopScreenRecording();
    handle.exit();
    navigate('/');
  };

  const nextSlide = () => {
    setShowAnswer(false);
    setCurrentSlideIndex((prevIndex) => {
      if (prevIndex + 1 < slides.length) {
        return prevIndex + 1;
      } else {
        handleExitFullscreen();
        return prevIndex;
      }
    });
  };

  if (!quiz) return <div>Loading...</div>;

  const slides = [
    { type: 'intro' },
    { type: 'thumbnail', thumbnail: quiz.thumbnail },
    ...quiz.questions.flatMap((question, index) => [
      { type: 'question', question },
      { type: 'transition', index }
    ]),
  ];

  const renderSlide = () => {
    const slide = slides[currentSlideIndex];

    if (slide.type === 'intro') {
      return <video src="../../src/assets/Intro.mp4" autoPlay onEnded={nextSlide} className="full-screen-media" />;
    }

    if (slide.type === 'thumbnail') {
      return (
        <img
          src={slide.thumbnail}
          alt="Quiz Thumbnail"
          className="full-screen-media"
          onLoad={() => setTimeout(nextSlide, 5000)}
        />
      );
    }

    if (slide.type === 'transition') {
      return <video src="../../src/assets/transition.mp4" autoPlay onEnded={nextSlide} className="full-screen-media" />;
    }

    if (slide.type === 'question') {
      const { question } = slide;
      const animationUrl = Object.values(question.backgroundAnimations)[0];

      return (
        <div className="question-slide full-screen-media">
          <video src={animationUrl} autoPlay loop muted className="background-video" />
          <div className="question-section">
            <div className="question-header">
              <div className="question-number">{Math.floor(currentSlideIndex / 2) + 1}</div>
              <div className="question-text">{question.questionText}</div>
            </div>
            <div className="question-body">
              <img 
                src={showAnswer ? question.answerPhotoUrl : question.questionPhotoUrl} 
                alt="Question" 
                className="question-image" 
              />
              <div className="options">
                {question.options.map((option, index) => (
                  <div
                    key={index}
                    className={`option ${showAnswer && option === question.correctAnswer ? 'correct' : ''}`}
                  >
                    {option}
                  </div>
                ))}
              </div>
            </div>
            <div className="timer-container">
              <div 
                className={`timer-bar ${timer <= 3 ? 'urgent' : ''}`} 
                style={{ width: `${(timer / 10) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <FullScreen handle={handle}>
      <div className="fullscreen-quiz">
        {!isQuizStarted ? (
          <div className="quiz-details">
            <h1>{quiz.title}</h1>
            <p>Number of questions: {quiz.numberOfQuestions}</p>
            <button onClick={startQuiz}>Start Quiz</button>
          </div>
        ) : (
          renderSlide()
        )}
      </div>
    </FullScreen>
  );
}

export default Quizpage;
