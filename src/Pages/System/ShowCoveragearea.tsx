import { useState, useEffect } from 'react';
import axios from "axios";

// הגדרת מבנה המשדר
interface Coverage {
    name: string,
    description: string,
    latitude: number,
    longitude: number,
    radius: number
}

function ShowCoveragearea() {
    const [CoverageAreas, setCoverageAreas] = useState<Coverage[]>([]);
    // שליפת נתונים מהשרת
    useEffect(() => {(async() => 
       await axios
        .get('http://localhost:5000/show-coverage-areas')
        .then((response) => {
              setCoverageAreas(response.data);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        })
    )} , []);
    return (
        <div>
            
        </div>
    );
}

export default ShowCoveragearea;
