import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css"; // ✅ ייבוא עיצוב ברירת מחדל של Leaflet
import { MapContainer, TileLayer, Circle, Marker, Popup, CircleMarker } from "react-leaflet";
import axios from "axios";
import L from "leaflet"; // ✅ לשימוש באייקונים מותאמים אישית
import "./TransmitterThumbnails.css";
import image from "../../../../public/9881850.png";
import Map from '../Map';
import { useNavigate } from 'react-router-dom';
import Heatmap from "./Heatmap/Heatmap";


// 📡 ממשק המתאר משדר
interface Transmitteronmap {
  name: string;
  latitude: number;
  longitude: number;
  allocatedRadius: number;
  awaiting: boolean;
}

function TransmitterThumbnails() {
  const [transmitters, setTransmitters] = useState<Transmitteronmap[]>([]);
  const [visibleTransmitters, setVisibleTransmitters] = useState<Transmitteronmap[]>([]);
  const [confirm, setConfirm] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchTransmitters = async () => {
      try {
        const response = await axios.get("http://localhost:5000/show-all-transmitter-on-map");
        setTransmitters(response.data);
        setVisibleTransmitters(response.data); // מציג את כל החלונות בהתחלה
      } catch (error) {
        console.error("Error fetching transmitters:", error);
      }
    };
    fetchTransmitters();
  }, []);

  

  const sendData = (lat : number, long : number) => {
    localStorage.setItem("sharedData", JSON.stringify({ lat, long }));
    navigate('/system');
  };

  const handleSwitchChange = async(transmistterName: string) => {
      await axios.post('http://localhost:5000/change-awaiting', {
        name: transmistterName,
      });
      window.location.reload();
  };

  
  return (
    <div className="thumbnails-container">
    <button className={confirm ? "box-a" : "toggle-heatmap-btn"} onClick={() => setConfirm((prev) => !prev)}>
       {confirm ?  "🔥 הצג מפת חום"   : "🔄 הצג רשימת משדרים"}
    </button>

     
      {confirm ? (
     visibleTransmitters.map((transmitter, index) => (
        <div key={index} className="thumbnail">
                    
          <h4 onClick={() => sendData(transmitter.latitude, transmitter.longitude)}>{transmitter.name}</h4>

          <MapContainer
            center={[transmitter.latitude, transmitter.longitude]}
            zoom={15}
            scrollWheelZoom={false}
            style={{ width: "100%", height: "280px", borderRadius: "15px" }}
          >
            {/* שכבת אריחים של OpenStreetMap */}
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {/* ✅ אייקון משדר */}
            <Marker
              position={[transmitter.latitude, transmitter.longitude]}
              icon={L.icon({
                iconUrl: `${image}`,
                iconSize: [50, 60],
                iconAnchor: [15, 45],
                popupAnchor: [1, -34],
              })}
            >
              <Popup>{transmitter.name}</Popup>
            </Marker>

            {/* ✅ עיגול שמסמן את אזור הכיסוי של המשדר */}
            <Circle
              center={[transmitter.latitude, transmitter.longitude]}
              radius={transmitter.allocatedRadius}
              pathOptions={{  color: "black", fillColor: "rgba(255, 255, 255, 0.1)", fillOpacity: 0.6  }}
            />
            {!transmitter.awaiting && (<>
                <CircleMarker
              center={[transmitter.latitude, transmitter.longitude]}
              radius={15}
              pathOptions={{ color: "transparent", fillColor: "rgba(64, 64, 64, 0.8)", fillOpacity: 0.7 }} /* תכלת בהיר */
              className="transmission-wave"
            />
            <CircleMarker
             center={[transmitter.latitude, transmitter.longitude]}
             radius={30}
             pathOptions={{ color: "transparent", fillColor: "rgba(96, 96, 96, 0.6)", fillOpacity: 0.5 }} /* כחול בהיר */
             className="transmission-wave"
            />
            <CircleMarker
             center={[transmitter.latitude, transmitter.longitude]}
             radius={50}
             pathOptions={{ color: "transparent", fillColor: "rgba(128, 128, 128, 0.5)", fillOpacity: 0.3 }} /* סגול כהה */
             className="transmission-wave"
            />
             <CircleMarker
      center={[transmitter.latitude, transmitter.longitude]}
      radius={45}
      pathOptions={{ color: "transparent", fillColor: "rgba(160, 160, 160, 0.4)", fillOpacity: 0.4 }} /* 💚 ירוק כהה */
      className="transmission-wave"
    />
    <CircleMarker
      center={[transmitter.latitude, transmitter.longitude]}
      radius={55}
      pathOptions={{ color: "transparent", fillColor: "rgba(192, 192, 192, 0.3)", fillOpacity: 0.3 }} /* 💚 ירוק כהה מאוד */
      className="transmission-wave"
    />
            </>)}
          </MapContainer>
          <div className="d1">
            <span>{transmitter.allocatedRadius}</span>
            <span>{transmitter.latitude}</span>
            <span>{transmitter.longitude}</span>
            <button
            className={`awaiting-btn ${transmitter.awaiting ? 'active' : 'inactive'}`}
            onClick={(e) => {
                handleSwitchChange(transmitter.name);
            }}>{transmitter.awaiting ? '🔴' : '🟢'}</button>
          </div>
        </div>
      ))
     ) : (
        <Heatmap/>
    )}
    </div>
  );
}

export default TransmitterThumbnails;
