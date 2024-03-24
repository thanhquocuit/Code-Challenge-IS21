import 'bootstrap/dist/css/bootstrap.min.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import AppTheme from "./theme/theme";
import { ChakraProvider } from '@chakra-ui/react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
//import reportWebVitals from './reportWebVitals';

// Application's pages components
import KanbanBoardPage from './pages/KanbanBoardPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';

/** 
 * Main app page routing table
 */
const router = createBrowserRouter([
  {
    path: "/",
    element: <KanbanBoardPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/admin",
    element: <AdminPage />,
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>

    {/* Setup: ChakraUI */}
    <ChakraProvider theme={AppTheme}>

      {/* Setup: React Router Dom */}
      <RouterProvider router={router} />

      {/* Generic alert dialog */}
    </ChakraProvider>

  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals(); 
