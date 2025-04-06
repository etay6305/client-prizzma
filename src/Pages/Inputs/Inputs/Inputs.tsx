import React from 'react';

interface Props {
    className: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
    type: string;
    value: string | number;
    placeHolder: string; 
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void; 
    required?: boolean; 
    min?: number; // ערך מינימלי שמותר להכניס
    max?: number; // ניתן לשנות בהתאם
}

const GenericSideButton: React.FC<Props> = (props) => {
    const { className, onChange, type, value, placeHolder, onKeyDown, required=false, min, max } = props;

     const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
       
          if (e.key === "_" || e.key === "-" || e.key === "+") {
            e.preventDefault(); // חוסם קלט של מקשים לא רצויים
            return;
          }
        if (onKeyDown) {
          onKeyDown(e); // קריאה לפונקציה שהועברה כפרופ (אם קיימת)
        }
      };

    return (
        <input className = {className}
        onChange = {onChange}
        type = {type}
        value = {value}
        placeholder = {placeHolder}
        onKeyDown = {handleKeyDown}
        required = {required}
        min={min}
        max={max}
        />
    )
}

export default GenericSideButton;
