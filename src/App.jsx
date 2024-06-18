import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Quizpage from './Pages/Quizpage/Quizpage.jsx';
import HomePage from './Pages/Homepage/Homepage.jsx';
import Createquizpage from './Pages/CreateQuizPage/Createquizpage.jsx';


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
  }
]);

const App = () => {
  return (
    <RouterProvider router={router} />
  );
};

export default App;

