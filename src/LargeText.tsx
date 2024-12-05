import { useState, useEffect } from 'react';
import './LargeText.css'; // ייבוא קובץ ה-CSS
import { Switch } from '@mui/material'; // יש להשתמש ב-@mui/material ולא ב-@mui/base

function HighContrast() {
  const [isLargeText, setIsLargeText] = useState(false); // משתנה שמאכסן אם הטקסט גדול או לא

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setIsLargeText(checked); // שינוי מצב ה-Switch
  };

  useEffect(() => {
    // כל פעם שמשתנה מצב ה-Switch, נוסיף או נוודא שמחלקת ה-CSS מתעדכנת
    if (isLargeText) {
      document.body.classList.add('large-text');
    } else {
      document.body.classList.remove('large-text');
    }
  }, [isLargeText]); // התגובה לשינוי מצב ה-Switch

  return (
    <div className="Switch">
      <Switch
        checked={isLargeText}  // אם ה-Switch פעיל, הטקסט יגדל
        onChange={handleSwitchChange}  // כששמים את ה-Switch במצב "on" או "off"
        inputProps={{ 'aria-label': 'Toggle text size' }} // תיאור לנגישות
      />
    </div>
  );
}

export default HighContrast;
