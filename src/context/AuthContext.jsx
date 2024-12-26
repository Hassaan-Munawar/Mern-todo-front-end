import { createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { AppRoutes } from "../constant/AppRoutes";

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      getUserInfo(token);
    } else {
      setLoading(false); 
    }
  }, []);

  const getUserInfo = (token) => {
    axios
      .get(AppRoutes.myInfo, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data.data);
        setUser(res.data.data);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
