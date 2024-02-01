import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import { useCookies } from "react-cookie";
import { useEffect } from "react";

export const ProtectedRoute = () => {
  const [cookies] = useCookies(["token"]);
  const { token, setToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (cookies.token) {
      setToken(cookies.token);
    }
    if (token === null) {
      navigate("/login");
    }
  }, [cookies.token, navigate, setToken, token]);



  // If authenticated, render the child routes
  return <Outlet />;
};
