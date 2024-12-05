import { useState, useEffect } from 'react';
import './HighContrast.css';
import { Slider } from '@mui/material';

function HighContrast() {
  const [brightness, setBrightness] = useState(1); // ערך ברירת המחדל של בהירות = 1 (רגיל)

  useEffect(() => {
    // כל פעם שהבהירות משתנה, נשנה את הערך ב-CSS
    document.body.style.filter = `brightness(${brightness})`;
  }, [brightness]); // נעדכן רק כשערך ה-brightness משתנה

  return (
    <div className='Slider'>
      <Slider
        value={brightness}  // הערך הנוכחי של ה-slioder
        onChange={(e : Event, newValue) => setBrightness(Number(newValue))} // עדכון הערך בעת הזזת הסליידר
        min={0.5}   // מינימום הבהירות - 50%
        max={2}     // מקסימום הבהירות - 200%
        step={0.01} // צעד של 1%
        aria-label="Brightness Control" // שם למטרת נגישות
        valueLabelDisplay="auto" // הצגת הערך בתצוגה
      />
    </div>
  );
}

export default HighContrast;
