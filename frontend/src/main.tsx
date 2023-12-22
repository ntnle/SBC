import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider, createHashRouter } from "react-router-dom";
import Request from '../components/Request';

const router = createHashRouter([
  {
    path: "/",
    element: <div>Hello world!</div>,
  },
  {
    path: "/:clubCode",
    element: <Request />,
  },
  {
    path: "/:clubCode/:admin",
    element: <Request />,
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
