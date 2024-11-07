import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';

function CreateNewPassword() {
  const [password, setPassword] = useState<string>(''); // השתמש ב-string במקום Number
  const [name, setName] = useState<string>('');
    const handleKeyDown = (e : any) => {
        if (e.key === 'Enter') {
          apiCall(e);
        }
      };

      const navigate = useNavigate();

      const apiCall = async (e : React.ChangeEvent<HTMLInputElement>) => {
  
        if (e) e.preventDefault();  // נוודא שאם הפונקציה נקראת מטופס, תבוצע מניעה של ברירת המחדל
    
        try {
          const response = await axios.post('http://localhost:4000/create-new-password', {
            name,
            password,
          });
    
          if (response.status === 200) {
            Swal.fire({
              title: 'הסיסמא שוחזרה בהצלחה',
              icon: 'success',
            });
            navigate('/login');
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
     
        

  return (
    <div className="CreateNewPassword">
        <div>
          <label>enter your name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            required
          />
        </div>
        <div>
          <label>enter your new password:</label>
          <input
            type="password"
            id="code"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            required
          />
        </div>
    </div>
  );
}
export default CreateNewPassword;



