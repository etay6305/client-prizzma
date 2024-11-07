import { useNavigate, Navigate } from 'react-router-dom';
//import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';


function DisconnectedBtn() {
    const [name, setName] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        axios.get('http://localhost:4000/getcookie', { withCredentials: true })
          .then((response) => {
            setName(response.data.user); // שמירת הנתונים ב-state
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      }, []); //ירוץ פעם אחת 
    
      const handleLogout = async () => {
        try {
            const response = await axios.delete('http://localhost:4000/deletecookie', {
                withCredentials: true, // ווידוא שליחת ה-cookie לשרת
            });
    
            if (response.status === 200) { // בדיקת הצלחה
                navigate('/login'); // ניתוב ל-login אחרי מחיקה
            }
        } catch (error) {
            console.error("Logout error:", error);
        }
    };
    
      
    
  return (
    <div className="DisconnectedBtn">
        <button  onClick={handleLogout} className="login-button">disconnected</button>
    </div>
  );
}

export default DisconnectedBtn;



