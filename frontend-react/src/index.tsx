import 'bootstrap/dist/css/bootstrap.min.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import AppTheme from "./theme/theme";
import { ChakraProvider } from '@chakra-ui/react';
import { Navigate, RouterProvider, createBrowserRouter, redirect } from 'react-router-dom';
//import reportWebVitals from './reportWebVitals';

// Application's pages components
import KanbanBoardPage from './pages/KanbanBoardPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import PageNotFound from './pages/PageNotFound';

import Backend from './model/Backend';
import { AlertDialog } from './component/AlertDialog';

/** 
 * Main app page routing table
 */
const router = createBrowserRouter([

  // The 404 page
  { path: "/404", element: <PageNotFound /> },

  // Route to the login page
  {
    path: "/login",
    loader: async () => { // If aldready having login session, nothing to visit the login page
      let ok = await Backend.isLogin()
      if (ok) return redirect('/') // No need to login, go directly to the home page

      return null // go to the login page
    },
    element: <LoginPage />
  },

  // Route to the main home page: kanban board.
  {
    path: "/",
    loader: async () => { // With login required
      let ok = await Backend.isLogin()
      if (!ok) return redirect('/login') // Require to login. Navigate to the login page

      return null // allow to access
    },
    element: <KanbanBoardPage />
  },

  {
    path: "/admin",
    loader: async () => {
      let ok = await Backend.isLogin()
      if (!ok || !Backend.isAdmin()) return redirect('/login') // With login and admin role required

      return null // allow to access
    },
    element: <AdminPage />,
  },

  // Unexpected path, navigate back to 404 page
  { path: "/*", element: <Navigate to="/404" replace={true} /> }
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>

    {/* Setup: ChakraUI */}
    <ChakraProvider theme={AppTheme}>

      {/* Setup: React Router Dom */}
      <RouterProvider router={router} />

      {/* Generic alert dialog */}
      <AlertDialog />

    </ChakraProvider>

  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals(); 
