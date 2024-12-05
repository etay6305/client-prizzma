import { useState, useEffect  } from 'react'
import './App.css'
import Header from './Components/Layout/Header';
import HighContrast from './HighContrast';
import LargeText from './LargeText';
//import Footer from './Components/Layout/Footer';


const TIME_SINCE_YG = 86400000


// פונקציה להחזרת השעה הנוכחית
function TimeNow() {
  const now = new Date();
  return now.toTimeString();
}

// components
function App() {
  const [time, setTime] = useState(TimeNow());
  const [days, setDays] = useState(346); //const
  const [visible, setVisible] = useState(true);
  

  const handleClose = () => {
    setVisible(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setDays((prevDays) => prevDays + 1);
    }, TIME_SINCE_YG);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(TimeNow());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`App`}>
      
      <header>
        <Header />
        <span className="Time">{time} |</span>
        <div className="accessibility-buttons">
          <LargeText/>
          <HighContrast/>
        </div>
      </header>

      {visible && (
        <div className="timer-box">
          <button id="X" onClick={handleClose}>X</button>
          <h1>Before {days} days</h1>
          <h2>אל תעשו י"ג "ד <br />זו תרמית</h2>
        </div>
      )}

     
    </div>
  );
}

export default App;
