import './ChangePassword.css';
import { useState} from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import BackBtn from '../../BackBtn';
import Inputs from '../Inputs/Inputs/Inputs';

function ChangePassword() {
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [new_name, setnewName] = useState('');

    const navigate = useNavigate();

    const handleKeyDown = (e : any) => {
      if (e.key === 'Enter') {
        apiCall();
      }
    };
    const apiCall = async () => {
        
        await axios.post('http://localhost:5000/change-password', {
          new_name: new_name,
          password: password,//password,  // שליחת הסיסמה לשרת
          name: name,//name
        })
          .then((response) => {
            // setData(response.data); // שמירת הנתונים ב-state
            // setDed('');
            console.log(response);
            if(response.status === 200) {
              Swal.fire({
                title: 'הפרטים שלך שונו בהצלחה',
                icon: 'success'
            }) 
               navigate('/login',);
            }
          })
          .catch((error) => {
            if (error.response) {
              const status = error.response.status;
              if (status === 404) {
                  Swal.fire({
                      title: 'משתמש לא נמצא',
                      icon: 'error'
                  });
              } else if (status === 409) {
                  Swal.fire({
                      title: 'שם משתמש חדש כבר קיים במערכת',
                      icon: 'error'
                  });
              } else if (status === 401) {
                  Swal.fire({
                      title: 'סיסמה נוכחית שגויה',
                      icon: 'error'
                  });
              } else {
                  Swal.fire({
                      title: 'שגיאת שרת',
                      icon: 'error'
                  });
              }
          } else {
              console.error("Error fetching data:", error);
              Swal.fire({
                  title: 'שגיאה לא ידועה',
                  icon: 'error'
              });
          }
        });
      };
    
  return (
    <div className="ChangePassword">
        <Inputs type='text' value={new_name} onChange={(e) => setnewName(e.target.value)} placeHolder='Enter your new name' className='login-input' onKeyDown={handleKeyDown} required/>
        <Inputs type='text' value={name} onChange={(e) => setName(e.target.value)} placeHolder='Enter name' className='login-input' onKeyDown={handleKeyDown} required/>
        <Inputs type='text' value={password} onChange={(e) => setPassword(e.target.value)} placeHolder='Enter password' className='login-input' onKeyDown={handleKeyDown} required/>
        <br/>
        <button  onClick={apiCall} className="login-button">change password</button>
        <BackBtn/>
    </div>
  );
}

export default ChangePassword;



