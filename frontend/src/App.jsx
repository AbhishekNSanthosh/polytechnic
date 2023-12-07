import './App.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: "hii"
    }
  ]);
  return (
    <RouterProvider router={router} />
  )
}

export default App
