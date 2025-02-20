import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./OverlapOfTransmitter.css";
import Draggable from 'react-draggable'; // ספריית גרירה
// הגדרת מבנה החפיפות
interface Conflict {
  transmitter1: string;
  transmitter2: string;
  overlapCoverage: boolean;
  overlapFrequency: boolean;
}

// מבנה של האזורים והחפיפות
interface ConflictsByArea {
  [areaId: string]: {
    conflicts: Conflict[];
    coveragePercentage: number;
  };
}

const OverlapOfTransmitter: React.FC = () => {
  const [conflicts, setConflicts] = useState<ConflictsByArea>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // שליפת נתוני חפיפות ואחוזי כיסוי
  useEffect(() => {
    const fetchData = async () => {
      try {
        // שליפת חפיפות
        const overlapsResponse = await axios.get('http://localhost:5000/check-overlaps-by-area'); // נתיב לשרת
        const overlapsData = overlapsResponse.data;

        // אחסון נתונים זמניים
        const updatedConflicts: ConflictsByArea = {};

        // עיבוד כל אזור
        for (const areaId in overlapsData) {
          // טיפול במקרה של "no-area"
          if (areaId === 'no-area') {
            updatedConflicts[areaId] = {
              conflicts: overlapsData[areaId],
              coveragePercentage: 0, // אין כיסוי לאזור שאינו משויך
            };
            continue;
          }

          try {
            // שליפת אחוז כיסוי לאזור הנוכחי
            const coverageResponse = await axios.get(`http://localhost:5000/coverage-percentage/${areaId}`);
            const coveragePercentage = coverageResponse.data.coveragePercentage;

            // שמירת החפיפות ואחוז הכיסוי
            updatedConflicts[areaId] = {
              conflicts: overlapsData[areaId],
              coveragePercentage: parseFloat(coveragePercentage),
            };
          } catch (coverageError) {
            console.error(`Error fetching coverage for area ${areaId}:`, coverageError);
            updatedConflicts[areaId] = {
              conflicts: overlapsData[areaId],
              coveragePercentage: 0, // ברירת מחדל במקרה של שגיאה
            };
          }
        }

        // שמירת התוצאות
        setConflicts(updatedConflicts);
        console.log(updatedConflicts);

      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  
  return (
    <Draggable>
    <div className="conflict-container">
      <h1>Conflict Checker & Coverage</h1>
      {Object.keys(conflicts).length === 0 ? (
        <p>No conflicts detected.</p>
      ) : (
        Object.keys(conflicts).map((areaId) => (
          <div key={areaId} className="conflict-section">
            <h2>Area ID: {areaId}</h2>
            <p><strong>Coverage Percentage:</strong> {conflicts[areaId].coveragePercentage}%</p>
            {conflicts[areaId].conflicts.length > 0 ? (
              <table className="conflict-table">
                <thead>
                  <tr>
                    <th>Transmitter 1</th>
                    <th>Transmitter 2</th>
                    <th>Coverage Overlap</th>
                    <th>Frequency Overlap</th>
                  </tr>
                </thead>
                <tbody>
                  {conflicts[areaId].conflicts.map((conflict, index) => (
                    <tr key={index}>
                      <td>{conflict.transmitter1}</td>
                      <td>{conflict.transmitter2}</td>
                      <td>{conflict.overlapCoverage ? 'Yes' : 'No'}</td>
                      <td>{conflict.overlapFrequency ? 'Yes' : 'No'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No conflicts in this area.</p>
            )}
          </div>
        ))
      )}
    </div>
    </Draggable>
  );
};

export default OverlapOfTransmitter;
