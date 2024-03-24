import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Quizpage from './Components/Quizpage/Quizpage.jsx';
import HomePage from './Components/Homepage/Homepage.jsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage/>
  },
  {
    path : "/quiz/:id",
    element : <Quizpage/>
  },
]);

const App = () => {
  return (
    <RouterProvider router={router} />
  );
};

export default App;

