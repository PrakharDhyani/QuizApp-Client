import React, { useEffect, useState,useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../Common/apis';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import QuizDetails from '../../Components/QuizDetails/QuizDetails';
import QuizSlide from '../../Components/QuizSlide/QuizSlide';
import './Quizpage.css';

function Quizpage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const handle = useFullScreenHandle();
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);

  const startScreenRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        audio: true,
        video: true
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

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await api.get(`/quizzes/${id}`);
        console.log(response)
        setQuiz(response.data.quiz);
      } catch (error) {
        console.error('Error fetching quiz:', error);
      }
    };

    fetchQuiz();
  }, [id]);

  const startQuiz = async () => {
    // await handle.enter();
    await startScreenRecording();
    setIsQuizStarted(true);  // Moved inside a separate function
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
    // handle.exit();
    stopScreenRecording();
    navigate('/');
  };

  const nextSlide = () => {
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

  return (
    // <FullScreen handle={handle}>
      <div className="fullscreen-quiz">
        {!isQuizStarted ? (
          <QuizDetails quiz={quiz} startQuiz={startQuiz} />
        ) : (
          <QuizSlide slide={slides[currentSlideIndex]} nextSlide={nextSlide} />
        )}
      </div>
    // </FullScreen>
  );
}

export default Quizpage;
