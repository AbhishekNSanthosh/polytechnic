import './App.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import LoginPage from './modules/LoginPage/LoginPage';
import Dashboard from './modules/Dashboard/Dashboard';
import Layout from './modules/Layout/Layout'
import Profile from './modules/Profile/Profile';
import Management from './modules/Management/Management';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LoginPage />
    },
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: '/dashboard',
          element: <Dashboard />
        },
        {
          path: '/profile',
          element: <Profile />
        },
        {
          path: '/user-management',
          element: <Management />
        }
      ]
    },
  ]);
  return (
    <RouterProvider router={router} />
  )
}

export default App
