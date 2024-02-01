import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import { ProtectedRoute } from "./protectedRoute";
import { Navbar } from "../components/navbar/page";
import Login from "../components/Login/Login";
import Home from "../components/Home/page";
import Task from "../components/Task/page";
import SubTask from "../components/Task/subTask/page";

const Routes = () => {
  const { token } = useAuth();

  const routesForPublic = [
    {
      path: "/",
      element: (
        <>
          <Navbar /> <Home />
        </>
      ),
    },
  ];

  // Define routes accessible only to authenticated users
  const routesForAuthenticatedOnly = [
    {
      path: "/",
      element: <ProtectedRoute />,
      children: [
        {
          path: "/task",
          element: (
            <>
              <Navbar />
              <Task />
            </>
          ),
        },
      ],
    },
    {
      path: "/",
      element: <ProtectedRoute />,
      children: [
        {
          path: "task/:taskId",
          element: (
            <>
              <Navbar />
              <SubTask />
            </>
          ),
        },
      ],
    },
  ];

  // Define routes accessible only to non-authenticated users
  const routeForLogin = {
    path: "/login",
    element: token ? (
      <Navigate to="/" />
    ) : (
      <main className="h-screen bg-slate-200">
        <Navbar />
        <Login />
      </main>
    ),
  };

  // Combine and conditionally include routes based on authentication status
  const router = createBrowserRouter([
    ...routesForPublic,
    routeForLogin,
    ...routesForAuthenticatedOnly,
  ]);

  // Provide the router configuration using RouterProvider
  return <RouterProvider router={router} />;
};

export default Routes;
