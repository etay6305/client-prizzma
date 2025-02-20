import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddTransmitterLocation.css'; // קובץ CSS מותאם אישית
import Swal from 'sweetalert2';
import Draggable from 'react-draggable'; // ספריית גרירה
// ממשק למשדרים
interface Transmitter {
  name: string;
  latitude: number;
  longitude: number;
  frequencyRange: string;
  areaId: number | null;
  coverageName: string;
}

const AddTransmitterLocation : React.FC = () => {
  const [transmitters, setTransmitters] = useState<Transmitter[]>([]);
  const [filterUnassigned, setFilterUnassigned] = useState(true); // מצב התחלה - לא משויכים
  const [loading, setLoading] = useState(true);
  const [latitude, setLatitude] = useState<{ [key: string]: string }>({});
  const [longitude, setLongitude] = useState<{ [key: string]: string }>({});
  // פונקציה לשליפת משדרים
  const fetchTransmitters = async () => {
    try {
      const response = await axios.get('http://localhost:5000/show-transmitters-with-coverage');
      setTransmitters(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching transmitters:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransmitters();
  }, []);

  const addLATandLONG = async (name: string) => {
    try {
        const response = await axios.patch('http://localhost:5000/AddLatAndLongtotransmitter', 
        {
            name: name,
            latitude: parseFloat(latitude[name]),
            longitude: parseFloat(longitude[name]),
        })
        if (response.status === 200) {
            console.log("add secssesful");
            Swal.fire({
                title: "נוספו קורדיננטות בהצלחה",
                icon: "success",
            });
        }
    } catch (error) {
        console.log('error', error);
    }
  }

  // סינון נתונים
  const filteredTransmitters = filterUnassigned
    ? transmitters.filter((transmitter) => transmitter.areaId === null)
    : transmitters.filter((transmitter) => transmitter.areaId !== null);

  return (
    <Draggable>
    <div className="unassigned-transmitters">
      <h1>Transmitters</h1>
      <button
        className="toggle-button"
        onClick={() => setFilterUnassigned(!filterUnassigned)}
      >
        {filterUnassigned ? 'משדרים לא בשימוש' : 'משדרים בשימוש'}
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="transmitter-table">
          <thead>
            <tr>
              <th>שם</th>
              <th>קו רוחב</th>
              <th>קו אורך</th>
              <th>טווח תדרים</th>
              <th>שיוך</th>
              {filterUnassigned === false &&(<th>איזור</th>)}
              {filterUnassigned === false &&(<th>קו רוחב</th>)}
              {filterUnassigned === false &&(<th>קו אורך</th>)}
            </tr>
          </thead>
          <tbody>
            {filteredTransmitters.map((transmitter, index) => (
              <tr key={index}>
                <td>{transmitter.name}</td>
                <td>{transmitter.latitude || 'N/A'}</td>
                <td>{transmitter.longitude || 'N/A'}</td>
                <td>{transmitter.frequencyRange}</td>
                <td>{transmitter.areaId ? 'משויך' : 'לא משויך'}</td>
                {transmitter.areaId && <td>{transmitter.coverageName}</td>}
                {filterUnassigned === false && (
                  <>
                    <td>
                      <input
                        type="number"
                        className="latitude"
                        placeholder="Latitude"
                        value={latitude[transmitter.name] || ''}
                        onChange={(e) =>
                          setLatitude((prev) => ({
                            ...prev,
                            [transmitter.name]: e.target.value,
                          }))
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="latitude"
                        placeholder="Longitude"
                        value={longitude[transmitter.name] || ''}
                        onChange={(e) =>
                          setLongitude((prev) => ({
                            ...prev,
                            [transmitter.name]: e.target.value,
                          }))
                        }
                      />
                    </td>
                    <td><button onClick={() => (addLATandLONG(transmitter.name))}>אוסף מיקום</button></td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    </Draggable>
  );
};

export default AddTransmitterLocation;
