import './App.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import LoginPage from './modules/LoginPage/LoginPage';
import Dashboard from './modules/Dashboard/Dashboard';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LoginPage />
    },
    {
      path: "/dashboard",
      element: <Dashboard />
    }
  ]);
  return (
    <RouterProvider router={router} />
  )
}

export default App
