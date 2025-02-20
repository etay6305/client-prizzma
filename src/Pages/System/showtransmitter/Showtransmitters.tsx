import "./ShowTransmitters.css";
import { useState, useEffect } from 'react';
import axios from "axios";
import Swal from 'sweetalert2';
import OkToDelete from "./Oktodelete";
import Draggable from 'react-draggable'; // ספריית גרירה

// הגדרת מבנה המשדר
interface Transmitter {
    name: string;
    frequencyRange: string;
    bandwidth: number;
    power: number;
    antennaType: string;
    coverageRadius: number;
    f: number;
    antennaGain: number;
    receiverSensitivity: number;
    noiseFigure: number;
    latitude: number;
    longitude: number;
}

function ShowTransmitters() {
    // משתנים ב-state
    const [transmitters, setTransmitters] = useState<Transmitter[]>([]);
    const [loading, setLoading] = useState(true);
    const [text, setText] = useState<string>('אין נתונים להצגה'); // טקסט ברירת מחדל
    const [radii, setRadii] = useState<{ [key: string]: string }>({});
    const [arrayisempty, setArrayisempty] = useState(false); // בדיקת ריקון
    const [confirmupdate, setConfirmupdate] = useState(false); //הצגת כפתור שמירה 
    const [antenaKind, setantenaKind] = useState<{ [key: string]: string }>({});
    const [nameOfCoverage, setNameOfCoverage] = useState<{ [key: string]: string }>({});
    // שליפת נתונים מהשרת
    useEffect(() => {
        const fetchTransmitters = async () => {
            try {
                const response = await axios.get('http://localhost:5000/show-transmitters');
                setTransmitters(response.data);

                // עדכון מיידי אם המערך ריק
                setArrayisempty(response.data.length === 0);

                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchTransmitters();
    }, []);

    // מחיקת משדר
    const handleDeleteTransmitter = async (name: string) => {
        try {
            const response = await axios.delete(`http://localhost:5000/delete-transmitter/${name}`);
            if (response.status === 200) {
                Swal.fire({
                    title: 'הישות נמחקה!',
                    icon: 'success',
                });

                // עדכון המערך והמצב מיידית
                const updatedTransmitters = transmitters.filter((t) => t.name !== name);// מעיךף את האובייקט שנמחק
                setTransmitters(updatedTransmitters);
                setArrayisempty(updatedTransmitters.length === 0); // בדיקה אם המערך ריק
            }
        } catch (error) {
            console.error("Error deleting transmitter:", error);
            Swal.fire({ title: 'שגיאה במחיקה!', icon: 'error' });
        }
    };



    // יצירת טבלת hallocations
    const handleCalculateAndAllocate = async (name: string) => {
        try {
            // חישוב רדיוס
            const radiusResponse = await axios.get(`http://localhost:5000/radius/${name}`);
            const radius = radiusResponse.data.radius;
            const allocationResponse = await axios.post(`http://localhost:5000/add-allocation-initial`, {
                transmitterName: name,
                allocatedRadius: parseFloat(radius), // שמירת הרדיוס המחושב
                nameOfCoverage: nameOfCoverage[name] || null // שליחת השם או null אם לא הוזן

            });
            if (allocationResponse.status === 200) {
                Swal.fire({
                    title: 'נוסף בהצלחה',
                    icon: 'success',
                });

                
                
            }
        } catch (error) {
            Swal.fire({ title: 'שגיאה בהקצרת משדר', icon: 'error' });
        }
    };

    // חישוב רדיוס
    const handleoneSecond = async (name: string) => {
        try {
            const response = await axios.get(`http://localhost:5000/radius/${name}`);
            if (response.status === 200) {
                setRadii((prevRadii) => ({
                    ...prevRadii,
                    [name]: response.data.radius
                }));
            }
        } catch (error) {
            console.error("Error calculating radius:", error);
            Swal.fire({ title: 'שגיאה בחישוב רדיוס!', icon: 'error' });
        }
    };
    //עדכון
    const handletree = async (old_name: string) => {
        try {
            const response = await axios.patch(`http://localhost:5000/update-transmitter`, {
                name: old_name,
                antennaType: antenaKind[old_name],
            });
    
            if (response.status === 200) {
                // עדכון הטבלה לאחר שמירה
                setTransmitters((prevTransmitters) =>
                    prevTransmitters.map((transmitter) =>
                        transmitter.name === old_name ? { ...transmitter, antennaType: antenaKind[old_name] } : transmitter
                    )
                );
    
                Swal.fire({
                    title: "עודכן בהצלחה!",
                    text: `השם שונה ל-${antenaKind}`,
                    icon: "success",
                });
    
                setConfirmupdate(false); // חזרה למצב כפתורים רגיל
            }
        } catch (error) {
            console.error("Error updating transmitter:", error);
            Swal.fire({
                title: "שגיאה בעדכון!",
                text: "בדוק שהשם אינו קיים כבר.",
                icon: "error",
            });
        }
    };
    

    // תצוגת מצב טעינה
    if (loading) return <p>Loading...</p>;

    return (
        <Draggable>
        <div className="ShowTransmitters">
            <h1>Transmitters List</h1>

            {/* כפתור רענון */}
            <button className="refresh-button" onClick={() => window.location.reload()}>
                Refresh
            </button>

            {/* הצגת הודעה אם המערך ריק  remember*/}
            {!transmitters.length && <p className="message3">{text}</p>} 

            {/* טבלה להצגת הנתונים */}
            {!arrayisempty && (
                <table>
                    <thead>
                        <tr>
                            <th>שם</th>
                            <th>טווח תדרים (Hz)</th>
                            <th>רוחב פס (Hz)</th>
                            <th>הספק (W)</th>
                            <th>סוג אנטנה</th>
                            <th>רדיוס כיסוי (m)</th>
                            <th>תדר (MHz)</th>
                            <th>רווח אנטנה (dB)</th>
                            <th>רגישות מקלט (dBm)</th>
                            <th>מקדם הרעש (dB)</th>
                            <th>רדיוס מחושב (m)</th>
                            <th>קו רוחב</th>
                            <th>קו אורך</th>
                            <th>פעולות</th>
                            
                        </tr>
                    </thead>
                    <tbody>
                        {transmitters.map((transmitter, index) => (
                            <tr key={index}>
                                <td>{transmitter.name}</td>
                                <td>{transmitter.frequencyRange} Hz</td>
                                <td>{transmitter.bandwidth} Hz</td>
                                <td>{transmitter.power} W</td>
                                <td>{transmitter.antennaType || "N/A"}
                                {confirmupdate &&<input 
                                        type="text"
                                        value={antenaKind[transmitter.name] || ''}
                                        onChange={(e) => setantenaKind((prev) => ({
                                            ...prev,
                                            [transmitter.name]: e.target.value, // עדכון ערך עבור משדר ספציפי
                                        }))}
                                        placeholder="new antenna type"
                                        className="name"
                                />}
                                </td>
                                <td>{transmitter.coverageRadius} m</td>
                                <td>{transmitter.f} MHz</td>
                                <td>{transmitter.antennaGain} dB</td>
                                <td>{transmitter.receiverSensitivity} dBm</td>
                                <td>{transmitter.noiseFigure} dB</td>
                                <td>{transmitter.latitude} dB</td>
                                <td>{transmitter.longitude} dB</td>
                                <td>{radii[transmitter.name] || "N/A"} m</td>
                                <td>
                                
                                {confirmupdate ? ( 
                                // מצב עדכון - כפתור שמירה
                                <button
                                    onClick={() => {
                                    handletree(transmitter.name); // שליחת שם לשמירה
                                    setConfirmupdate(false); // חזרה למצב רגיל
                                    }}
                                    className="primary"
                                >
                                    שמירה
                                </button>
                             ) : ( //true יציג חלק ראשון false יציג חלק שני
                               // מצב רגיל - שלושה כפתורים
                                 <>
                                {<input
                                        type="text"
                                        value={nameOfCoverage[transmitter.name] || ""}
                                        onChange={(e) =>
                                        setNameOfCoverage((prev) => ({
                                        ...prev,
                                        [transmitter.name]: e.target.value,
                                        }))
                                        }
                                        placeholder="שייך לאיזור"
                                    />}
                                <button className="secondary" onClick={() => handleoneSecond(transmitter.name)}>חישוב רדיוס</button>
                                      <OkToDelete name={transmitter.name} onDelete={handleDeleteTransmitter} />
                                <button className="primary" onClick={() => setConfirmupdate(true)}>עדכון</button>
                                <button className="secondary" onClick={() => handleCalculateAndAllocate(transmitter.name)}>
                                    הקצאת hallocations
                                </button>
                               
                                </>
                              )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
        </Draggable>
    );
}

export default ShowTransmitters;
