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
import ListUser from './modules/ListUser/ListUser';

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
          element: <Management />,
        },
        {
          path: '/user-management/list-student',
          element: <ListUser />
        },
        {
          path: '/user-management/list-faculty',
          element: <ListUser />
        },
        {
          path: '/user-management/list-admin',
          element: <ListUser />
        },
      ]
    },
  ]);
  return (
    <RouterProvider router={router} />
  )
}

export default App
