import "./Transmitterbox.css";
import { useState } from 'react';
import axios from "axios";
import Swal from 'sweetalert2';
import Draggable from 'react-draggable'; // ספריית גרירה

function Transmitterbox() {

    const [name, setName] = useState<string>(''); // מחרוזת
    const [frequencyRange, setFrequencyRange] = useState<string>(''); // מחרוזת
    const [bandwidth, setBandwidth] = useState<number>(0.0); // מספר עשרוני
    const [power, setPower] = useState<number>(0.0); // מספר עשרוני
    const [antennaType, setAntennaType] = useState<string>(''); // מחרוזת
    const [coverageRadius, setCoverageRadius] = useState<number>(0.0); // מספר עשרוני
    const [f, setF] = useState<number>(0.0); // מספר עשרוני
    const [antennaGain, setAntennaGain] = useState<number>(0.0); // מספר עשרוני
    const [receiverSensitivity, setReceiverSensitivity] = useState<number>(0.0); // מספר עשרוני
    const [noiseFigure, setNoiseFigure] = useState<number>(0.0);
    
    // פונקציית קריאה לשרת
    const apiCall = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault(); // מניעת ריענון הדף

        try {
            const response = await axios.post('http://localhost:5000/add-transmitter', {
                name,
                frequencyRange,
                bandwidth,
                power,
                antennaType,
                coverageRadius,
                f,
                antennaGain,
                receiverSensitivity,
                noiseFigure
            });

            if (response.status === 200) {
                Swal.fire({
                    text: 'ישות נוספה בהצלחה',
                    icon: 'success',
                });
            setTimeout(() => {
                window.location.reload(); // טוען מחדש את הנתונים לאחר הוספת ישות
            }, 2500);
            }
        } catch (error) {
            Swal.fire({
                title: 'בעיה בהוספת ישות',
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
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="name"
                className="name"
                required
            />
            
            <h1>טווח תדרים</h1>
            <input
                type="text"
                value={frequencyRange}
                onChange={(e) => setFrequencyRange(e.target.value)}
                placeholder="frequency range"
                className="frequency_range"
                required
            />

            <h1>רוחב פס</h1>
            <input
                type="number"
                value={bandwidth}
                onChange={(e) => setBandwidth(parseFloat(e.target.value))}
                placeholder="bandwidth"
                className="bandwidth"
                required
            />

            <h1>הספק</h1>
            <input
                type="number"
                value={power}
                onChange={(e) => setPower(parseFloat(e.target.value))}
                placeholder="power"
                className="power"
                required
            />

            <h1>סוג אנטנה</h1>
            <input
                type="text"
                value={antennaType}
                onChange={(e) => setAntennaType(e.target.value)}
                placeholder="antenna type"
                className="antenna_type"
                required
            />

            <h1>רדיוס כיסוי</h1>
            <input
                type="number"
                value={coverageRadius}
                onChange={(e) => setCoverageRadius(parseFloat(e.target.value))}
                placeholder="coverage radius"
                className="coverage_radius"
                required
            />

            <h1>תדר</h1>
            <input
                type="number"
                value={f}
                onChange={(e) => setF(parseFloat(e.target.value))}
                placeholder="F"
                className="F"
                required
            />

            <h1>רווח אנטנה</h1>
            <input
                type="number"
                value={antennaGain}
                onChange={(e) => setAntennaGain(parseFloat(e.target.value))}
                placeholder="antenna gain"
                className="antenna_gain"
                required
            />

            <h1>רגישות מקלט</h1>
            <input
                type="number"
                value={receiverSensitivity}
                onChange={(e) => setReceiverSensitivity(parseFloat(e.target.value))}
                placeholder="receiver sensitivity"
                className="receiver_sensitivity"
                required
            />

            <h1>מקדם רעש</h1>
            <input
                type="number"
                value={noiseFigure}
                onChange={(e) => setNoiseFigure(parseFloat(e.target.value))}
                placeholder="noiseFigure"
                className="noiseFigure"
                required
            />
            {/* כפתור שליחת הנתונים */}
            <button onClick={apiCall}>Add Transmitter</button>
        </div>
    </div>
    </Draggable>
    );
}

export default Transmitterbox;
