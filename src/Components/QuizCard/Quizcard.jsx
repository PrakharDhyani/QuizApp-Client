import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../Common/apis'; // Assuming 'api' contains the base URL for your API
import './Quizcard.css';

function Quizcard({ quiz }) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handlePlay = async () => {
    const confirmed = window.confirm('Do you want to start the quiz?');
    if (confirmed) {
      // Fetch quiz details if necessary (already available here)
      navigate(`/quiz/${quiz._id}`);
    }
  };

  const handleUpdate = () => {
    console.log('Update clicked');
  };

  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this quiz?');
    if (confirmed) {
      try {
        await api.delete(`quizzes/${quiz.id}`);
        console.log('Quiz deleted');
        // Optionally, you can add logic to remove the quiz from the UI after successful deletion
      } catch (error) {
        console.error('Failed to delete the quiz', error);
      }
    }
  };

  return (
    <div
      className='quiz-card'
      style={{ backgroundColor: quiz.background_color }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {quiz.title}
      {isHovered && (
        <div className='modal'>
          <p>{quiz.title}</p>
          <button onClick={handlePlay}>Play</button>
          <button onClick={handleUpdate}>Update</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  );
}

export default Quizcard;
