import './App.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import LoginPage from './modules/LoginPage/LoginPage';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LoginPage />
    }
  ]);
  return (
    <RouterProvider router={router} />
  )
}

export default App
