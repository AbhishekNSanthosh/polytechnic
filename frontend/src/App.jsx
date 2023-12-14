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
import CreateUser from './modules/CreateUser/CreateUser';
import DisplayLetter from './modules/DisplayLetter/DisplayLetter';

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
          element: <Dashboard />,
          children:[
            {
              path: '/letter/:id',
              element: <DisplayLetter />
            },
          ]
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
        {
          path: '/user-management/create-student',
          element: <CreateUser />
        },
        {
          path: '/user-management/create-faculty',
          element: <CreateUser />
        },
        {
          path: '/user-management/create-admin',
          element: <CreateUser />
        },
      ]
    },
  ]);
  return (
    <RouterProvider router={router} />
  )
}

export default App
