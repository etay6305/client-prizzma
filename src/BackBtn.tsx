import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function BackBtn() {
    const [press, setPress] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        if (press && navigate) {
          navigate('/')
        }
      }, [press, navigate]);
    
      
    
  return (
    <div className="DisconnectedBtn">
        <button  onClick={() => setPress(true)} className="login-button">go back</button>
    </div>
  );
}

export default BackBtn;



