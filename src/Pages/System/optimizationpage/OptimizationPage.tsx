import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OptimizationPage.css'; // קובץ CSS מותאם אישית
import Swal from 'sweetalert2';
import Draggable from 'react-draggable'; // ספריית גרירה

// ממשק למשדרים
interface Transmitter {
  areaId: number | null;
  transmitterName: string;
  allocatedRadius: number;  // תיקון השם alocatedRadius ל-allocatedRadius
}

interface Coverage {
  areaId: number;
  name: string;
  radius: number;
}

const OptimizationPage: React.FC = () => {
  const [transmitters, setTransmitters] = useState<Transmitter[]>([]);
  const [loading, setLoading] = useState(true);  // התחל ב-true כדי להציג טעינה ברירת מחדל
  const [coverages, setCoverages] = useState<Coverage[]>([]);
  const [selectedAreaId, setSelectedAreaId] = useState<string>('');  // הוספת state עבור הערך שנבחר
  const [selectedTransmitters, setSelectedTransmitters] = useState<Transmitter[]>([]); // המשדרים שנבחרו

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/show-all-transmitters-whitout-coverage');
        console.log(response.data);
        setTransmitters(response.data);
      } catch (error) {
        console.error('Error fetching data:', error); // טיפול בשגיאות
        Swal.fire({
          icon: 'error',
          title: 'Something went wrong',
          text: 'Failed to fetch transmitters',
        });
      } finally {
        setLoading(false); // להפסיק להציג "Loading..." אחרי קבלת התשובה או שגיאה
      }
    };

    fetchData(); // קריאה לפונקציה האסינכרונית
  }, []); // המערך הריק אומר שהפונקציה תתבצע רק פעם אחת בעת טעינת הרכיב


  useEffect(() => {
    const fetchData1 = async () => {
      try {
        const response = await axios.get('http://localhost:5000/show-coverage-areas');
        console.log(response.data);
        setCoverages(response.data);
      } catch (error) {
        console.error('Error fetching data:', error); // טיפול בשגיאות
        Swal.fire({
          icon: 'error',
          title: 'Something went wrong',
          text: 'Failed to fetch coverage areas',
        });
      } finally {
        setLoading(false); // להפסיק להציג "Loading..." אחרי קבלת התשובה או שגיאה
      }
    };

    fetchData1(); // קריאה לפונקציה האסינכרונית
  }, []); // המערך הריק אומר שהפונקציה תתבצע רק פעם אחת בעת טעינת הרכיב

  const checkoptimization = async (name: string) => {  // קבלת areaId מתוך ה-state
    try {
      // שליחת הבקשה לאופטימיזציה
      const response = await axios.post('http://localhost:5000/optimize-transmitters', { name });
        
      if (response.status === 200) {
        // עדכון המשדרים שנבחרו ב-state אחרי קבלת התשובה
        setSelectedTransmitters(response.data.selectedTransmitters);
      }

      console.log(response.data); // הצגת התשובה ב-console
    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: 'error',
        title: 'Optimization failed',
        text: 'Error during optimization',
      });
    }
  };

  

  // סינון נתונים
  const filteredTransmitters = transmitters.filter((transmitter) => transmitter.areaId === null);

  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAreaId(e.target.value); // עדכון ה-state עם הערך שנבחר
  };

  const handleOptimization = () => {
    if (selectedAreaId) {
      checkoptimization(selectedAreaId); // קריאה לפונקציה עם ה-areaId שנבחר
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Please select a coverage area',
      });
    }
  };
   
   return (
    <Draggable>
    <div className="unassigned-transmitters">
      <h1>Transmitters</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="transmitter-table">
          <thead>
            <tr>
              <th>שם משדר</th>
              <th>רדיוס הקצאה</th> {/* הוספת עמודה של allocatedRadius */}
            </tr>
          </thead>
          <tbody>
            {filteredTransmitters.map((transmitter, index) => (
              <tr key={index}>
                <td>{transmitter.transmitterName}</td>
                <td>{transmitter.allocatedRadius}</td> {/* הצגת allocatedRadius */}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <label htmlFor="options">בחר איזור גיאוגרפי:</label>
      <select className="options" onChange={handleAreaChange}>  {/* הוספת onChange לעדכון ה-state */}
        <option value="">-- בחר איזור --</option>
        {coverages.map((coverage, index) => (
            <option key={index} value={coverage.name}>{coverage.name}</option>
        ))}
      </select>

      <button onClick={handleOptimization}>אופטימיזציה</button>  {/* כפתור להרצת האלגוריתם */}

      {/* הצגת המשדרים שנבחרו */}
      {selectedTransmitters.length > 0 && (
        <div>
          <h2>Transmitters Selected:</h2>
          <ul>
            {selectedTransmitters.map((transmitter, index) => (
              <li key={index}>{transmitter.transmitterName} - {transmitter.allocatedRadius} meters</li>
            ))}
          </ul>
        </div>
      )}
    </div>
    </Draggable>
  );
};

export default OptimizationPage;
