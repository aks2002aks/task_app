import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import axios from "axios";

interface AuthContextType {
  token: string | null;
  setToken: (newToken: string | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    axios.post(`${process.env.REACT_APP_PUBLIC_API_URL}/api/checkTokenValidity`, { token })
      .then((response) => {
        if (!response.data.success) {
          setToken(null);
        }
      })
      .catch((error) => {
        console.error("Error verifying token:", error);
        setToken(null);
      });
  }, [token]);

  const contextValue = useMemo(() => ({ token, setToken }), [token]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
