import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import './Map.css'; // ודא שהנתיב נכון
import axios from 'axios';
import DisconnectedBtn from '../../Components/Layout/Disconnected'; // עדכון נתיב אם יש צורך

// יצירת אייקון מותאם אישית עבור הסימון במפה
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],  // גודל האייקון
  iconAnchor: [12, 41], // מיקום החץ של האייקון
  popupAnchor: [1, -34], // מיקום הפופאפ של האייקון
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  shadowSize: [41, 41], // גודל הצל
});

function MapWithRadius() {
  const [latitude, setLatitude] = useState(32.0853); // תל אביב
  const [longitude, setLongitude] = useState(34.7818);
  const [radius, setRadius] = useState(1000); // רדיוס ברירת מחדל במטרים
  const [markers, setMarkers] = useState<any[]>([]); // שים לב לעדכון הטיפוס של markers
  const [name, setName] = useState<string | null>(null);
  
  const navigate = useNavigate();

  // שמירה על שם המשתמש אם הוא מחובר
  useEffect(() => {
    axios.get('http://localhost:4000/getcookie', { withCredentials: true })
      .then((response) => {
        setName(response.data.user); // שמירת שם המשתמש ב-state
        console.log(name);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // הפניה למסך כניסה אם המשתמש לא מחובר
  useEffect(() => {
    if (name === '') {
      console.log('User not logged in. Redirecting to login...');
      navigate('/login');
    } else if (name !== null) {
      console.log('User is logged in:', name);
    }
  }, [name, navigate]);

  // מאזין ללחיצות על המפה ומוסיף סימון
  function MapClickHandler() {
    useMapEvents({
      click(e) {
        setMarkers((prevMarkers) => [
          ...prevMarkers,
          { lat: e.latlng.lat, lng: e.latlng.lng },
        ]);
      },
    });
    return null;
  }

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
          />
        </label>
      </div>

      <MapContainer
        center={[latitude, longitude]}
        zoom={13}
        style={{ height: '100vh', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <MapClickHandler />

        {markers.map((marker, index) => (
          <Marker key={index} position={[marker.lat, marker.lng]} icon={customIcon} />
        ))}

        <Circle
          center={[latitude, longitude]}
          radius={radius}
          color="red"
          fillOpacity={0.2}
        />
      </MapContainer>
    </div>
  );
}

export default MapWithRadius;
