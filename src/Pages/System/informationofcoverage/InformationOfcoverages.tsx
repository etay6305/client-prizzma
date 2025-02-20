import React, { useState } from 'react';
import './InformationOfcoverage.css';
import Draggable from 'react-draggable'; // ספריית גרירה
import AddCoveragearea from '../addcoveragearea/AddCoveragearea';

interface citya {
  name: string;
  latitude: number;
  longitude: number;
}
const cities = [
    { name: 'תל אביב', latitude: 32.0853, longitude: 34.7818, coverageRadius: 15 },
  { name: 'ירושלים', latitude: 31.7683, longitude: 35.2137, coverageRadius: 20 },
  { name: 'חיפה', latitude: 32.7940, longitude: 34.9896, coverageRadius: 18 },
  { name: 'באר שבע', latitude: 31.2518, longitude: 34.7913, coverageRadius: 12 },
  { name: 'אשדוד', latitude: 31.8014, longitude: 34.6435, coverageRadius: 10 },
  { name: 'אילת', latitude: 29.5581, longitude: 34.9482, coverageRadius: 8 },
  { name: 'נצרת', latitude: 32.7019, longitude: 35.3035, coverageRadius: 9 },
  { name: 'רמת גן', latitude: 32.0823, longitude: 34.8101, coverageRadius: 11 },
  { name: 'פתח תקווה', latitude: 32.0840, longitude: 34.8878, coverageRadius: 13 },
  { name: 'אשקלון', latitude: 31.6692, longitude: 34.5743, coverageRadius: 10 },
  { name: 'טבריה', latitude: 32.7940, longitude: 35.5312, coverageRadius: 12 },
  { name: 'הרצליה', latitude: 32.1663, longitude: 34.8437, coverageRadius: 9 },
  { name: 'ראשון לציון', latitude: 31.9730, longitude: 34.7925, coverageRadius: 11 },
  { name: 'מודיעין', latitude: 31.8980, longitude: 35.0104, coverageRadius: 14 }
];

const InformationOfcoverage = () => {
  const [searchQuery, setSearchQuery] = useState(''); // מצב לשאילתת החיפוש
  const [selectedCity, setSelectedCity] = useState<citya | null>(null); // מצב לעיר שנבחרה
  const [openAddCoveragearea, setOpenAddCoveragearea] = useState(false);

  const filteredCoverageAreas = cities.filter((city) =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase())
  ); // סינון אזורים לפי החיפוש

  const handleCitySelect = (city: citya) => {
    setSelectedCity(city); // עדכון המצב כאשר נבחרה עיר
  };
  
  const toggleAddCoveragearea = () => {
    setOpenAddCoveragearea(!openAddCoveragearea); // משנה את מצב פתיחת רכיב הוספת אזור
  };
  return (
    <Draggable>
    <div className="info-container">
      <h1 className="info-title">מידע על ערים בישראל</h1>
      <input
        type="text"
        className="info-search"
        placeholder="חפש עיר..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <ul className="info-list">
        {filteredCoverageAreas.map((city, index) => (
          <li key={index} className="info-item" onClick={() => handleCitySelect(city)} onDoubleClick={toggleAddCoveragearea}>
            <strong>{city.name}</strong>: קו רוחב {city.latitude}, קו אורך {city.longitude}, רדיוס כיסוי (במטרים) {city.coverageRadius.toLocaleString()} מטר
          </li>
        ))}
      </ul>


{/* הצגת רכיב הוספת אזור כיסוי */}
{openAddCoveragearea && selectedCity && (
   <div className={`add-coverage-area-container ${openAddCoveragearea ? 'show' : ''}`}>
   <AddCoveragearea 
     name={selectedCity.name} 
     latitude={selectedCity.latitude} 
     longitude={selectedCity.longitude} 
   />
 </div>
  )}
  </div>
   </Draggable>
  );
};

export default InformationOfcoverage;
