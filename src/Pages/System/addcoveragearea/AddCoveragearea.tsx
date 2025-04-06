import "../transmitterBox/Transmitterbox.css";
import React, { useState, useEffect } from 'react';
import axios from "axios";
import Swal from 'sweetalert2';
import Draggable from 'react-draggable'; // ספריית גרירה
import Inputs from '../../Inputs/Inputs/Inputs';


interface prop {
    name: string;
    latitude: number;
    longitude: number;
}
function AddCoveragearea(props: prop) {
  const [name, setName] = useState<string>(props.name);
  const [description, setDescription] = useState<string>('');
  const [latitude, setLatitude] = useState<number>(props.latitude);
  const [longitude, setLongitude] = useState<number>(props.longitude);
  const [radius, setRadius] = useState<number>(0.0);
  const apiCall = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // מניעת ריענון הדף

    try {
        const response = await axios.post('http://localhost:5000/add-coverage-area', {
            name,
            description,
            latitude,
            longitude,
            radius
        });

        if (response.status === 200) {
            Swal.fire({
                text: 'איזור גיאוגרפי נוסף בהצלחה',
                icon: 'success',
            });
        setTimeout(() => {
            window.location.reload(); // טוען מחדש את הנתונים לאחר הוספת ישות
        }, 2500);
        }
    } catch (error) {
        Swal.fire({
            title: 'בעיה בהוספת איזור',
            icon: 'warning'
        });
        console.error("Error fetching data:", error);
    }
};
  
  
  return (
    <Draggable>
        <div className="Transmitterbox">
        <div className="Trans">
            <h1>שם</h1>
            <Inputs type='text' value={name} onChange={(e) => setName(e.target.value)} placeHolder='name' className="name" required/>
            <h1>תיאור</h1>
            <Inputs type='text' value={description} onChange={(e : any) => setDescription(e.target.value)} placeHolder='description' className="frequency_range" required/>
            <h1>קו רוחב</h1>
            <Inputs type='number' value={latitude} onChange={(e) => setLatitude(parseFloat(e.target.value))} placeHolder='bandwidth' className="bandwidth" required/>
            <h1>קו אורך</h1>
            <Inputs type='number' value={longitude} onChange={(e) => setLongitude(parseFloat(e.target.value))} placeHolder='power' className="power" required/>
            <h1>רדיוס</h1>
            <Inputs type='number' value={radius} onChange={(e) => setRadius(parseFloat(e.target.value))} placeHolder='radius' className="power" required/>
            {/* כפתור שליחת הנתונים */}
            <button onClick={apiCall}>Add Coverage area</button>
        </div>
     </div>
     </Draggable>
  );
}

export default AddCoveragearea;
