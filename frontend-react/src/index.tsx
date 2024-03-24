import 'bootstrap/dist/css/bootstrap.min.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import AppTheme from "./theme/theme";
import { ChakraProvider } from '@chakra-ui/react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
//import reportWebVitals from './reportWebVitals';

import KanbanBoardPage from './KanbanBoardPage';

/** 
 * Main app page routing table
 */
const router = createBrowserRouter([
  {
    path: "/",
    element: <KanbanBoardPage />,
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>

    {/* Setup: ChakraUI */}
    <ChakraProvider theme={AppTheme}>

      {/* Setup: React Router Dom */}
      <RouterProvider router={router} />
    </ChakraProvider>

  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
