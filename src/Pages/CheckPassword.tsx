import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';

function CheckPassword() {
  const [code, setCode] = useState<number>(0); // קביעת טיפוס מספרי עבור הקוד
    // const location = useLocation();
    // const { random } = location.state || {}; // אם state לא קיים, תצא בריק
     
    const handleKeyDown = (e : any) => {
        if (e.key === 'Enter') {
          apiCall(e);
        }
      };

      const navigate = useNavigate();

      const apiCall = async (e : React.ChangeEvent<HTMLInputElement>) => {
  
        if (e) e.preventDefault();  // נוודא שאם הפונקציה נקראת מטופס, תבוצע מניעה של ברירת המחדל
    
        try {
          const response = await axios.post('http://localhost:4000/enter-email-code', {
            code,
          });
    
          if (response.status === 200) {
            Swal.fire({
              title: 'מעולה, הינך מתבקש להזין סיסמא חדשה',
              icon: 'success',
            });
            navigate('/createnewpassword');
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          Swal.fire({
            title: 'הקוד שהזנת שגוי',
            icon: 'error',
          });
        }
      };
     

  return (
    <div className="CheckPassword">
        <div>
          <label>enter your code:</label>
          <input
            type="number"
            id="code"
            value={code}
            onChange={(e) => setCode(Number(e.target.value))}
            onKeyDown={handleKeyDown}
            min="100000" // הגבלת מינימום ל-6 ספרות
            max="999999" // הגבלת מקסימום ל-6 ספרות
            required
          />
        </div>
    </div>
  );
}
export default CheckPassword;



