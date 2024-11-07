import Reac, { useState, useEffect  } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './Components/Layout/Header';
//import Footer from './Components/Layout/Footer';


// פונקציה להחזרת השעה הנוכחית
function TimeNow() {
  const now = new Date();
  return now.toTimeString();
}

function App() {
  const [time, setTime] = useState(TimeNow());
  const [days, setDays] = useState(346);
  const [visible, setVisible] = useState(true);
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  const handleClose = () => {
    setVisible(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setDays((prevDays) => prevDays + 1);
    }, 86400000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(TimeNow());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`App ${largeText ? 'large-text' : ''} ${highContrast ? 'high-contrast' : ''}`}>
      <header>
        <Header />
        <span className="Time">{time} |</span>
        <div className="accessibility-buttons">
          <button onClick={() => setLargeText(!largeText)}>Text Size</button>
          <button onClick={() => setHighContrast(!highContrast)}>High Contrast</button>
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
