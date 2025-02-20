import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from "../../../Pages/login/Login";
import HomePage from "../../../Pages/homepage/HomePage";
import "./Header.css";
import Map from "../../../Pages/System/Map";
import SighnUp from "../../../Pages/sighnup/SighnUp";
import ChangePassword from "../../../Pages/changepassword/ChangePassword";
import { UserProvider } from "../../UserContext";
import axios from "axios";
import Chat from "../../../Additives/Chat";
import ForgetApassword from "../../../Pages/ForgetApassword";
import CheckPassword from "../../../Pages/CheckPassword";
import CreateNewPassword from "../../../Pages/CreateNewPassword";
// רכיב Header
function Header() {
  const [name, setName] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/getcookie' , { withCredentials: true })
      .then((response) => {
        if(response.data.user) {
          setName(response.data.user); // שמירת הנתונים ב-state
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []); // תלות ריקה כדי להריץ רק בפעם הראשונה

  return (
    <div className="Header">
      <span className="logo">TUNER-X</span>
      <nav>
        <span></span>
        <Link to="/login">
          <span>Go to Login |</span>
        </Link>
        <Link to="/homepage">
          <span>Go to HomePage |</span>
        </Link>
        <Link to="/sighnup">
          <span>Go to SignUp |</span>
        </Link>
        <Link to="/change-password">
          <span>Go to change password |</span>
        </Link>
        {name && (
          <Link to="/go-to-chat">
            <span>Go to chat |</span>
          </Link>
        )}      
      </nav>
    </div>
  );
}

// רכיב App
function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Header />} />
          <Route path="/login" element={<Login />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/system" element={<Map />} />
          <Route path="/sighnup" element={<SighnUp />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/go-to-chat" element={<Chat />} />
          <Route path="/forget-password" element={<ForgetApassword />} />
          <Route path="/check" element={<CheckPassword />} />
          <Route path="/createnewpassword" element={<CreateNewPassword />} />


        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;

