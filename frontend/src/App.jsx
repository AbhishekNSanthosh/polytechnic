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
import CreateGriev from './modules/CreateGrievPage/CreateGriev';
import DisplayLetter from './modules/DisplayLetter/DisplayLetter';
import CreateUser from './modules/CreateUser/CreateUser';

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
        },
        {
          path: '/view-letter/:id',
          element: <DisplayLetter />
        },
        {
          path: '/view-letter/:id/manage',
          element: <DisplayLetter />
        },
        {
          path: '/profile',
          element: <Profile />
        },
        {
          path: '/dashboard/create-grievance',
          element: <CreateGriev />
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
          path: '/user-management/list-teacher',
          element: <ListUser />
        },
        {
          path: '/user-management/list-admin',
          element: <ListUser />
        },
        {
          path: '/user-management/create-student',
          element: <CreateUser/>
        },
        {
          path: '/user-management/create-teacher',
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
