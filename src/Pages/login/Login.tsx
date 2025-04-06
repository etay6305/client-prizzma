import "./Login.css";
import  { useState, useContext } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
//import { UserContext } from '../Components/UserContext';
import BackBtn from "../../BackBtn";
import Inputs from "../Inputs/Inputs/Inputs";

function Login() {
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  //const { setUser } = useContext(UserContext); // שימוש ב-Context


  
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
  
        //setUser(name);
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
  
       const apiCallSecond = () => {
          navigate('/sighnup');
       }

       const apiCallSecond2 = () => {
        navigate('/forget-password');
     }
  
  

  return (
    <div className="Login1">
       <div className="login1">
       <h1>Login to system</h1>
        <Inputs type="text" value={name} onChange={(e : any) => setName(e.target.value)} className="login_input" placeHolder="Enter your name" onKeyDown={handleKeyDown} required/>
        <Inputs type="password" value={password} onChange={(e : any) => setPassword(e.target.value)} className="login_input" placeHolder="Enter your password" onKeyDown={handleKeyDown} required/>
        <br/>
        <button  onClick={apiCall} className="login-button">Sign In</button>
        <button onClick={apiCallSecond} className="login-button">Sign Up</button>
        <BackBtn/>
        {/* <h1>{ded}</h1>
        <h1>{data}</h1>  */}
       </div>
    </div>
  );
}

export default Login;
