import './SighnUp.css';
import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import BackBtn from '../../BackBtn';

function SighnUp() {
  const [name, setName] = useState<string>();
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [ded, setDed] = useState<string>('');
  const navigate = useNavigate();
  
  // const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //    if (e.key === 'Enter') {
  //      apiCall(e);
  //    }
  //  };
  
  const apiCall = async (e : React.FormEvent<HTMLFormElement>) => {
  
    if (e) e.preventDefault();  // נוודא שאם הפונקציה נקראת מטופס, תבוצע מניעה של ברירת המחדל

    try {
      const response = await axios.post('http://localhost:5000/sighn-password', {
        name, // שליחת שם המשתמש לשרת
        password, // שליחת הסיסמה לשרת
        email
      });

      if (response.status === 200) {
        Swal.fire({
          title: 'נשלח אימייל לאימות!',
          text: 'אנא בדוק את תיבת הדואר שלך לאימות.',
          icon: 'success',
        });
        navigate('/login'); // ניתוב למסלול ההתחברות
        navigate('/login'); // ניתוב למסלול ההתחברות
      }
    } catch (error) {
        Swal.fire({
            title: 'שם משתמש כבר תפוס',
            icon: 'warning'
        })
      console.error("Error fetching data:", error);
      setDed('Error registering user'); // הצגת הודעת שגיאה
    }
  };
  
  return (
    <div className="SighnUp">
      <h1>Sign Up</h1>
      <form onSubmit= {apiCall}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            // onKeyDown={handleKeyDown}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            // onKeyDown={handleKeyDown}
            required
          />
        </div>
        <div>
          <label htmlFor="email">email:</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            // onKeyDown={handleKeyDown}
            required
          />
        </div>
        <button type="submit">Sign Up</button>
        <BackBtn/>
      </form>
      {ded && <h3>{ded}</h3>}
    </div>
  );
}

export default SighnUp;
