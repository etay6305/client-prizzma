import { useState, useEffect  } from 'react'
import './App.css'
import Header from './Components/Layout/header/Header';
import HighContrast from './HighContrast';
import LargeText from './LargeText';
//import Footer from './Components/Layout/Footer';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Pages/login/Login';
import HomePage from './Pages/homepage/HomePage';
import Map from '../src/Pages/System/Map';
import SighnUp from './Pages/sighnup/SighnUp';
import ChangePassword from './Pages/changepassword/ChangePassword';
import Chat from './Additives/Chat';
import ForgetApassword from './Pages/ForgetApassword';
import CheckPassword from './Pages/CheckPassword';
import CreateNewPassword from './Pages/CreateNewPassword';
import TransmitterThumbnails from './Pages/System/TransmitterThumbnails/TransmitterThumbnails';
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
    <BrowserRouter>
    <div className={`App`}>
      
      <header>
        <span className="Time">{time} |</span>
        <div className="accessibility-buttons">
          <LargeText/>
          <HighContrast/>
        </div>
        <Routes>
          <Route path="/" element={<Header/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/system" element={<Map />} />
          <Route path="/sighnup" element={<SighnUp />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/go-to-chat" element={<Chat />} />
          <Route path="/forget-password" element={<ForgetApassword />} />
          <Route path="/check" element={<CheckPassword />} />
          <Route path="/createnewpassword" element={<CreateNewPassword />} />
          <Route path="/Thumbnails" element={<TransmitterThumbnails />} />
        </Routes>
      </header>
    </div>
    </BrowserRouter>
  );
}

export default App;
