import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Quizpage from './Pages/Quizpage/Quizpage.jsx';
import HomePage from './Pages/Homepage/Homepage.jsx';
import Createquizpage from './Pages/CreateQuizPage/Createquizpage.jsx';
import TestQuiz from './Pages/test/TestQuiz.jsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage/>
  },
  {
    path : "/quiz/:id",
    element : <Quizpage/>
  },
  {
    path : "/quiz/create",
    element : <Createquizpage/>
  },
  {
    path : "/test-quiz/:id",
    element : <TestQuiz/>
  },
]);

const App = () => {
  return (
    <RouterProvider router={router} />
  );
};

export default App;

