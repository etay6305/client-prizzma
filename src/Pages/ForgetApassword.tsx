import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';

function ForgetApassword() {
    const [email, setEmail] = useState('');
    const handleKeyDown = (e : any) => {
        if (e.key === 'Enter') {
          apiCall(e);
        }
      };

      const navigate = useNavigate();
      const apiCall = async (e : React.ChangeEvent<HTMLInputElement>) => {
  
        if (e) e.preventDefault();  // נוודא שאם הפונקציה נקראת מטופס, תבוצע מניעה של ברירת המחדל
    
        try {
          const response = await axios.post('http://localhost:4000/forgetyourpassword', {
            email
          });
    
          if (response.status === 200) {
            Swal.fire({
              title: 'הודעה לשחזור סיסמא נשלחה לחשבונך',
              text: 'אנא בדוק את תיבת הדואר שלך לאימות.',
              icon: 'success',
            });
            navigate('/check');
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      
  return (
    <div className="ForgetApassword">
        <div>
          <label htmlFor="email">enter your email:</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            required
          />
        </div>
    </div>
  );
}
export default ForgetApassword;



