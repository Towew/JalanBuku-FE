import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useContext, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./context/userContext";
import "bootstrap/dist/css/bootstrap.min.css";
import Homepage from "./pages/Homepage/Homepage";
import DetailBook from "./pages/Detail Book/DetailBook";
import Profile from "./pages/Profile/Profile";
import Cart from "./pages/Cart/Cart";
import AdminTransaction from "./pages/Admin Transaction/AdminTransaction";
import AddBook from "./pages/Admin Add Book/AddBook";
import AdminComplain from "./pages/Complain/AdminComplain";
import Complain from "./pages/Complain/Complain";
import { API, setAuthToken } from "./config/api";
import UpdateBook from "./pages/Admin Add Book/UpdateBook";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  let navigate = useNavigate();

  const [state, dispatch] = useContext(UserContext);

  useEffect(() => {
    // Redirect Auth
    if (state.isLogin == false) {
      navigate("/");
    } else {
      if (state.user.role == "admin") {
        navigate("/");
      } else if (state.user.role == "customer") {
        navigate("/");
      }
    }
  }, [state]);

  const checkUser = async () => {
    try {
      const response = await API.get("/check-auth");

      // If the token incorrect
      if (response.status === 404) {
        return dispatch({
          type: "AUTH_ERROR",
        });
      }

      console.log(response);

      // Get user data
      let payload = response.data.data.user;
      // Get token from local storage
      payload.token = localStorage.token;

      // Send data to useContext
      dispatch({
        type: "USER_SUCCESS",
        payload,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <Routes>
      <Route exact path="/" element={<Homepage />} />
      <Route exact path="/detail/:id" element={<DetailBook />} />
      <Route exact path="/profile" element={<Profile />} />
      <Route exact path="/cart" element={<Cart />} />
      <Route exact path="/admin-transaction" element={<AdminTransaction />} />
      <Route exact path="/add-book" element={<AddBook />} />
      <Route exact path="/admin-complain" element={<AdminComplain />} />
      <Route exact path="/complain" element={<Complain />} />
      <Route exact path="/update-book/:id" element={<UpdateBook />} />
    </Routes>
  );
}

export default App;
