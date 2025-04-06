import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import "./Header.css";
import { UserProvider } from "../../UserContext";
import axios from "axios";
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
    <div className="Header1">
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
export default Header;

