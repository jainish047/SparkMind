import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./index.css";
import { useEffect } from "react";
import Header from "./components/Header";
import { fetchUserDetails, setToken } from "./context/authSlice";
import { setAuthToken } from "./API/axiosConfig";
import { Toaster } from "./components/ui/toaster";
import { getCountries, getLanguages, getSkills } from "./context/generalSlice";
import { getToken } from "./API/authentication";
import { getLists } from "./context/listSlice";
import { SocketProvider } from "./context/SocketProvide.jsx";

function App() {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    const storeToken = async () => {
      let Token = localStorage.getItem("authToken") || (await getToken());

      if (
        Token &&
        !["/auth/login", "/auth/signup"].includes(location.pathname)
      ) {
        setAuthToken(Token);
        dispatch(setToken(Token));
        // dispatch(fetchUserDetails());
      }

      console.log("token->", Token);
      console.log("user->", user);
    };

    storeToken();

    dispatch(getSkills());
    dispatch(getCountries());
    dispatch(getLanguages());
  }, [dispatch]);

  // Fetch user details after token is set
  useEffect(() => {
    if (token) {
      dispatch(fetchUserDetails());
      dispatch(getLists());
    }
  }, [token, dispatch]);

  return (
    <SocketProvider>
      <div className="grid grid-rows-[60px,1fr] h-screen w-screen overflow-hidden">
        <Header />
        <div className="h-full w-full overflow-y-auto overflow-x-hidden border">
          <Outlet />
        </div>
        <Toaster />
      </div>
    </SocketProvider>
  );
}

export default App;
