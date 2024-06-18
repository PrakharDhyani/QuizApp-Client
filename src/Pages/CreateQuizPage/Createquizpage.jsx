import React, { useState } from 'react';
import api from '../../Common/apis';
import "./Createquizpage.css";

function Createquizpage() {
  const [step, setStep] = useState(1);
  const [quizDetails, setQuizDetails] = useState({
    title: '',
    thumbnail: null,
    numQuestions: 1,
  });
  const [questions, setQuestions] = useState([]);

  const predefinedAnimations = [
    { name: 'Animation 1', file: 'animation1.mp4' },
    { name: 'Animation 2', file: 'animation2.mp4' },
    { name: 'Animation 3', file: 'animation3.mp4' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuizDetails({
      ...quizDetails,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setQuizDetails({
      ...quizDetails,
      [name]: files[0],
    });
  };

  const handleNext = () => {
    setQuestions(Array.from({ length: quizDetails.numQuestions }, () => ({
      questionText: '',
      options: ['', '', '', ''],
      correctOption: '',
      questionPhoto: null,
      answerPhoto: null,
      backgroundAnimation: 'text',
      predefinedAnimation: '',
      backgroundGif: null,
      backgroundMp4: null,
    })));
    setStep(2);
  };

  const handleQuestionChange = (index, e) => {
    const { name, value } = e.target;
    const newQuestions = [...questions];
    newQuestions[index][name] = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (index, optionIndex, e) => {
    const { value } = e.target;
    const newQuestions = [...questions];
    newQuestions[index].options[optionIndex] = value;
    setQuestions(newQuestions);
  };

  const handleQuestionFileChange = (index, e) => {
    const { name, files } = e.target;
    const newQuestions = [...questions];
    newQuestions[index][name] = files[0];
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', quizDetails.title);
      formData.append('thumbnail', quizDetails.thumbnail);
      formData.append('numQuestions', quizDetails.numQuestions);
      formData.append('questions', JSON.stringify(questions));

      questions.forEach((question, index) => {
        if (question.questionPhoto) {
          formData.append(`questionPhoto${index}`, question.questionPhoto);
        }
        if (question.answerPhoto) {
          formData.append(`answerPhoto${index}`, question.answerPhoto);
        }
        if (question.backgroundGif) {
          formData.append(`backgroundGif${index}`, question.backgroundGif);
        }
        if (question.backgroundMp4) {
          formData.append(`backgroundMp4${index}`, question.backgroundMp4);
        }
      });

      const response = await api.post('/quizzes/createQuiz', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Quiz created successfully:', response.data);
    } catch (error) {
      console.error('Error creating quiz:', error);
    }
  };

  return (
    <div className="create-quiz-form">
      {step === 1 && (
        <form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
          <div className="inputDiv">
            <label>Title of Quiz</label>
            <input
              type="text"
              name="title"
              value={quizDetails.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="inputDiv">
            <label>Upload Thumbnail</label>
            <input
              type="file"
              name="thumbnail"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
          </div>
          <div className="inputDiv">
            <label>Number of Questions</label>
            <input
              type="number"
              name="numQuestions"
              min="1"
              value={quizDetails.numQuestions}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit">Next</button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit}>
          {questions.map((question, index) => (
            <div key={index} className="question-form">
              <div>
                <label>Question {index + 1}</label>
                <input
                  type="text"
                  name="questionText"
                  value={question.questionText}
                  onChange={(e) => handleQuestionChange(index, e)}
                  required
                />
              </div>
              <div>
                <label>Options</label>
                {question.options.map((option, optionIndex) => (
                  <input
                    key={optionIndex}
                    type="text"
                    name={`option${optionIndex}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, optionIndex, e)}
                    required
                  />
                ))}
              </div>
              <div>
                <label>Correct Option</label>
                <select
                  name="correctOption"
                  value={question.correctOption}
                  onChange={(e) => handleQuestionChange(index, e)}
                  required
                >
                  {question.options.map((option, optionIndex) => (
                    <option key={optionIndex} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Question Photo</label>
                <input
                  type="file"
                  name="questionPhoto"
                  accept="image/*"
                  onChange={(e) => handleQuestionFileChange(index, e)}
                />
              </div>
              <div>
                <label>Answer Photo</label>
                <input
                  type="file"
                  name="answerPhoto"
                  accept="image/*"
                  onChange={(e) => handleQuestionFileChange(index, e)}
                />
              </div>
              <div>
                <label>Background Animation</label>
                <select
                  name="backgroundAnimation"
                  value={question.backgroundAnimation}
                  onChange={(e) => handleQuestionChange(index, e)}
                >
                  <option value="gif">Upload GIF</option>
                  <option value="mp4">Upload MP4</option>
                  <option value="predefined">Predefined Animation</option>
                </select>
                {question.backgroundAnimation === 'gif' && (
                  <input
                    type="file"
                    name="backgroundGif"
                    accept="image/gif"
                    onChange={(e) => handleQuestionFileChange(index, e)}
                  />
                )}
                {question.backgroundAnimation === 'mp4' && (
                  <input
                    type="file"
                    name="backgroundMp4"
                    accept="video/mp4"
                    onChange={(e) => handleQuestionFileChange(index, e)}
                  />
                )}
                {question.backgroundAnimation === 'predefined' && (
                  <select
                    name="predefinedAnimation"
                    value={question.predefinedAnimation}
                    onChange={(e) => handleQuestionChange(index, e)}
                  >
                    <option value="">Select an animation</option>
                    {predefinedAnimations.map((animation) => (
                      <option key={animation.file} value={animation.file}>
                        {animation.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          ))}
          <button type="submit">Create Quiz</button>
        </form>
      )}
    </div>
  );
}

export default Createquizpage;
