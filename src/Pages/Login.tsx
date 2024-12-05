import "./Login.css";
import  { useState, useContext } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { UserContext } from '../Components/UserContext';
import BackBtn from "../BackBtn";

function Login() {
  // הגדרת state לאחסון הנתונים מה-API
  // const [data, setData] = useState('');
  // const [ded, setDed] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const { setUser } = useContext(UserContext); // שימוש ב-Context


  
  const navigate = useNavigate();

  const handleKeyDown = (e : any) => {
    if (e.key === 'Enter') {
      apiCall();
    }
  };

  const apiCall = async () => {
    try {
      const response = await axios.post('http://localhost:5000/submit-password', {
        password: password, // שליחת הסיסמה לשרת
        name: name, // שליחת שם המשתמש
      });
  
      console.log(response);
  
      if (response.status === 200) {
        Swal.fire({
          title: 'ברוך הבא',
          icon: 'success',
        });
  
        setUser(name);
        localStorage.setItem('connected', JSON.stringify(name));
  
        // שליחת בקשה ליצירת קוקי
        await axios.post('http://localhost:5000/createcookie', {
          name: name,
      }, {
          withCredentials: true, // Ensure this is included
      });
        navigate('/system', { state: { name: name } }); // ניתוב עם משתנה state
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire({
        title: 'שם משתמש או סיסמה שגויים',
        icon: 'error',
      });
      // navigate("/signup"); // אם צריך, אפשר לנתב לעמוד הרישום
    }
  };
  

  // // פונקציה לקריאת API השנייה
  // const apiCallSecond = () => {
  //   axios.get('http://localhost:4000/noimnan')
  //     .then((response) => {
  //       setDed(response.data); // שמירת הנתונים ב-state
  //       setData('');
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data:", error);
  //     });
  // };
       const apiCallSecond = () => {
          navigate('/sighnup');
       }

       const apiCallSecond2 = () => {
        navigate('/forget-password');
     }
  
  

  return (
    <div className="Login">
       <div className="login-container">
       <h1>Login to system</h1>
        <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)} // עדכון הסיסמה ב-state
        onKeyDown={handleKeyDown}
        placeholder="Enter your name"
         className="login-input"
         required
        />
        <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)} // עדכון הסיסמה ב-state
        onKeyDown={handleKeyDown}
        placeholder="Enter password"
         className="login-input"
         required
        />
        <br/>
        <button  onClick={apiCall} className="login-button">Sign In</button>
        <button onClick={apiCallSecond} className="login-button">Sign Up</button>
        <button onClick={apiCallSecond2}  className="login-button">Forgeta password</button>
        <BackBtn/>
        {/* <h1>{ded}</h1>
        <h1>{data}</h1>  */}
       </div>
    </div>
  );
}

export default Login;
