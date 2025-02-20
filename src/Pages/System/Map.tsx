import React, { useState, useEffect } from 'react';
import { RMap, RLayerTile, RLayerVector, RFeature } from 'rlayers';
import 'ol/ol.css';
import axios from 'axios';
import { fromLonLat } from 'ol/proj';
import { Circle as OlCircle, Point } from 'ol/geom';
import { Style, Fill, Stroke, Icon, Text } from 'ol/style';
import { useNavigate } from 'react-router-dom';
import DisconnectedBtn from '../../Components/Layout/Disconnected';
import './Map.css';
import SideButton from './sideButtons/sideButton';
import Grph from './Grph/Grph';
const markerStyle = new Style({
  image: new Icon({
    src: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    scale: 0.5,
  }),
});

const transmitterStyle = new Style({
  image: new Icon({
    src: '\public\משדר', // הנתיב לתמונה בתוך תיקיית public/images
    scale: 0.1,
  }),
});

// הגדרת מבנה המשדר
interface Coverage {
  areaId: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  radius: number;
}
interface Transmitter {
  name: string;
  latitude: number;
  longitude: number;
  allocatedRadius: number;
}

function MapWithRadius() {
  const [latitude, setLatitude] = useState(32.0853); // תל אביב
  const [longitude, setLongitude] = useState(34.7818);
  const [radius, setRadius] = useState(1000); // רדיוס ברירת מחדל במטרים
  const [markers, setMarkers] = useState<any[]>([]);
  const [name, setName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [CoverageAreas, setCoverageAreas] = useState<Coverage[]>([]); // שמירה על שטחי כיסוי
  const [activeCoverage, setActiveCoverage] = useState<number | null>(null); // מציין איזה אזור פתוח
  const [searchQuery, setSearchQuery] = useState<string>(''); // אחסון טקסט החיפוש
  const [allTransmitteronmap, setallTransmitteronmap] = useState<Transmitter[]>([]);
  const [activeTransmitterName, setActiveTransmitterName] = useState<string | null>(null);
  const navigate = useNavigate();

  // שמירה על שם המשתמש אם הוא מחובר
  useEffect(() => {
    axios
      .get('http://localhost:5000/getcookie', { withCredentials: true })
      .then((response) => {
        setName(response.data.user);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // הפניה למסך כניסה אם המשתמש לא מחובר
  useEffect(() => {
    if (!isLoading) {
      if (name === '' || name === null) {
        console.error('User not logged in. Redirecting...');
        navigate('/login');
      }
    }
  }, [name, isLoading, navigate]);

  const handleMapClick = (event: any) => {
    const [lon, lat] = event.coordinate;
    setMarkers((prevMarkers) => [...prevMarkers, { lat, lng: lon }]);
  };

  // שליפת נתונים מהשרת
  useEffect(() => {
    axios
      .get('http://localhost:5000/show-coverage-areas')
      .then((response) => {
        console.log('Coverage areas data from server:', response.data);
        // הוסף radius אם לא קיים
        const coverageWithRadius = response.data.map((coverage: Coverage) => ({
          ...coverage,
          radius: coverage.radius || 1000, // ערך ברירת מחדל של 1000 מטר
        }));
        setCoverageAreas(coverageWithRadius);
      })
      .catch((error) => {
        console.error('Error fetching coverage areas:', error);
      });
  }, []);

  const handleCoverageClick = (areaId: number) => {
    // אם לוחצים שוב על אותו אזור - סוגרים אותו, אחרת פותחים אותו
    setActiveCoverage(activeCoverage === areaId ? null : areaId);
    };

    const filteredCoverageAreas = CoverageAreas.filter((coverage) =>
      coverage.name.toLowerCase().includes(searchQuery.toLowerCase())
    ); // סינון אזורים לפי החיפוש


    const deleteCoverage = (areaId: number) => {
      // שליחה לשרת למחוק את המרחב עם ה-areaId הספציפי
      axios
        .delete(`http://localhost:5000/delete-coverage/${areaId}`)
        .then((response) => {
          console.log('Coverage deleted:', response.data);
          // עדכון ה-state לאחר מחיקת המרחב
          setCoverageAreas((prevAreas) => prevAreas.filter((coverage) => coverage.areaId !== areaId));
        })
        .catch((error) => {
          console.error('Error deleting coverage:', error);
        });
    };
    
    // שליפת נתונים מהשרת
  useEffect(() => {
    axios
      .get('http://localhost:5000/show-all-transmitter-on-map')
      .then((response) => {
        console.log('Transmitters:', response.data); // בדוק את התגובה מהשרת
          setallTransmitteronmap(response.data);
      })
      .catch((error) => {
        console.error('Error fetching Transmitter:', error);
      });
  }, []);

    // פונקציה לחישוב אם משדר נמצא בתוך האזור
    const isTransmitterInCoverage = (transmitter: Transmitter, coverage: Coverage) => {
      const distance = getDistance(
        { lat: transmitter.latitude, lon: transmitter.longitude },
        { lat: coverage.latitude, lon: coverage.longitude }
      );
      return distance <= coverage.radius;
    };

    // פונקציה שפותחת את המידע של שטח כיסוי
  const handleCoverageClick1 = (coverageId: number) => {
    setActiveCoverage(coverageId);
    
    // חיפוש משדרים שנמצאים בתוך האזור
    const transmittersInArea = allTransmitteronmap.filter((transmitter) => {
      const coverage = CoverageAreas.find((area) => area.areaId === coverageId);
      return coverage ? isTransmitterInCoverage(transmitter, coverage) : false;
    });

    // בחירת המשדר הראשון שנמצא בתוך האזור
    if (transmittersInArea.length > 0) {
      setActiveTransmitterName(transmittersInArea.map(transmitter => transmitter.name).join(', ')); // שים כאן את שם המשדר
    } else {
      setActiveTransmitterName(null);
    }
  };

    // פונקציה לחישוב מרחק בין שתי נקודות
  const getDistance = (point1: { lat: number; lon: number }, point2: { lat: number; lon: number }) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (point2.lat - point1.lat) * (Math.PI / 180);
    const dLon = (point2.lon - point1.lon) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(point1.lat * (Math.PI / 180)) *
        Math.cos(point2.lat * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c * 1000; // Convert to meters
    return distance;
  };

  
  return (
    <div className="map-container">
      <div className="input-container">
        <DisconnectedBtn />
        <label>
          Latitude:
          <input
            type="number"
            value={latitude}
            onChange={(e) => setLatitude(parseFloat(e.target.value))}
          />
        </label>
        <label>
          Longitude:
          <input
            type="number"
            value={longitude}
            onChange={(e) => setLongitude(parseFloat(e.target.value))}
          />
        </label>
        <label>
          Radius (meters):
          <input
            type="number"
            value={radius}
            onChange={(e) => setRadius(parseFloat(e.target.value))}
            min={0}
          />
        </label>
      </div>
      
      {activeCoverage && (
      <div className="coverage-info-box">
      <h2 className="coverage-header">Transmitters in Coverage Area {activeCoverage}</h2>
      {activeTransmitterName ? (
           <div className="transmitter-info">
              <p><strong>Active Transmitter:</strong> {activeTransmitterName}</p>
           </div>
         ) : (
              <p className="no-transmitters">No transmitters in this area</p>
            )}
         </div>
)}

      <div className="coverage-bar">
        {/* הצגת האזורים המסוננים */}
        {filteredCoverageAreas.length > 0 ? (
          filteredCoverageAreas.map((coverage) => (
            <div
              className="coverage-item"
              key={coverage.areaId}
              onClick={() => handleCoverageClick(coverage.areaId)}
            >
              <strong>{coverage.name}</strong>
              {activeCoverage === coverage.areaId && (
                <div className="coverage-details">
                  <p>description: {coverage.description}</p>
                  <p>Latitude: {coverage.latitude}</p>
                  <p>Longitude: {coverage.longitude}</p>
                  <p>Radius: {coverage.radius} meters</p>
                  <button onClick={() => deleteCoverage(coverage.areaId)}>🗑️</button>
                </div>
              )}
            </div>
          ))
        ) : (
          <span>אין אזורים זמינים להצגה.</span>
        )}
      {/* שדה חיפוש */}
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="חפש לפי שם אזור"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // עדכון בזמן אמת של טקסט החיפוש
        />
      </div>
    </div>

      <Grph/>
      <SideButton/>
      <RMap
        className="map"
        initial={{ center: fromLonLat([longitude, latitude]), zoom: 13 }}
        onClick={handleMapClick}
      >
        <RLayerTile url="https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <RLayerVector>
          {/* עיגול רדיוס */}
          <RFeature
            geometry={new OlCircle(fromLonLat([longitude, latitude]), radius)}
            style={new Style({
              stroke: new Stroke({ color: 'red', width: 2 }),
              fill: new Fill({ color: 'rgba(255, 0, 0, 0.2)' }),
            })}
          />
          {/* שטחי כיסוי */}
          {CoverageAreas.map((coverage) => (
            <RFeature
              key={coverage.areaId}
              geometry={new OlCircle(fromLonLat([coverage.longitude, coverage.latitude]), coverage.radius)}
              style={new Style({
                stroke: new Stroke({ color: 'blue', width: 2 }),
                fill: new Fill({ color: 'rgba(0, 0, 255, 0.2)' }),
                text: new Text({
                  text: coverage.name, // שם האזור
                  font: '40px Calibri, sans-serif',
                  fill: new Fill({ color: 'black' }),
                  stroke: new Stroke({ color: 'white', width: 3 }),
                  offsetX: 0,
                  offsetY: 0,
                }),
              })}
              onClick={() => handleCoverageClick1(coverage.areaId)}          
            />
          ))}
          {/*Transmitters - משדרים*/}
          {allTransmitteronmap.map((transmitter) => (
            <RFeature
            key={transmitter.name}
            geometry={new OlCircle(fromLonLat([transmitter.longitude, transmitter.latitude]), transmitter.allocatedRadius)}
            style={new Style({
              stroke: new Stroke({ color: 'gray', width: 2 }),
              fill: new Fill({ color: 'rgba(0, 0, 255, 0.2)' }),
              text: new Text({
                text: transmitter.name, // שם האזור
                font: '40px Calibri, sans-serif',
                fill: new Fill({ color: 'black' }),
                stroke: new Stroke({ color: 'white', width: 3 }),
                offsetX: 0,
                offsetY: 0,
              }),
              // הוספת אייקון עם הגדרת transmitterStyle
            image: transmitterStyle.getImage() || undefined, // שימוש ב-image מה-style שהגדרת
            })}
          />
          ))}
          {/* סמנים */}
          {markers.map((marker, index) => (
            <RFeature
              key={index}
              geometry={new Point(fromLonLat([marker.lng, marker.lat]))}
              style={markerStyle}
            />
          ))}
        </RLayerVector>
      </RMap>
    </div>
  );
}

export default MapWithRadius;
