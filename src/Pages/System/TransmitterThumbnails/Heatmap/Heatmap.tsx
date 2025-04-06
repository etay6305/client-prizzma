import { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import L from "leaflet";
import "leaflet.heat";



// 📡 מבנה הנתונים של המשדרים
interface Transmitteronmap {
  name: string;
  latitude: number;
  longitude: number;
  allocatedRadius: number;
  awaiting: boolean;
}

// ✅ רכיב שמוסיף שכבת חום למפה
const HeatmapLayer = () => {
  const map = useMap(); // קבלת אובייקט המפה
  const [transmitters, setTransmitters] = useState<Transmitteronmap[]>([]);

  // שליפת המשדרים מה-API
  useEffect(() => {
    const fetchTransmitters = async () => {
      try {
        const response = await axios.get("http://localhost:5000/show-all-transmitter-on-map");
        setTransmitters(response.data);
      } catch (error) {
        console.error("Error fetching transmitters:", error);
      }
    };
    fetchTransmitters();
  }, []);
  const a = transmitters.filter((t) => t.awaiting === false);
  // יצירת והוספת שכבת החום
  useEffect(() => {
    if (!map || a.length === 0) return;

    // הפיכת המשדרים לפורמט המתאים למפת חום
    const heatmapPoints = a.map((t) => [t.latitude, t.longitude, 1] as [number, number, number]);

    // שימוש ב- `L as any` כדי להימנע משגיאות TypeScript
    const heatLayer = (L as any).heatLayer(heatmapPoints, {
      radius: 25, // גודל הנקודה
      blur: 15, // רמת טשטוש
      maxZoom: 15, // זום מקסימלי להצגת חום
      minOpacity: 0.5, // שקיפות מינימלית
    });

    heatLayer.addTo(map); // הוספת שכבת החום למפה

    return () => {
      map.removeLayer(heatLayer); // ניקוי השכבה כשהרכיב יוצא מה-DOM
    };
  }, [map, transmitters]);

  return null;
};

// ✅ רכיב ראשי שמכיל את המפה
const Heatmap = () => {
    // ✅ מבטיח שכל העמוד יכוסה
const mapStyle = {
    position: "fixed" as const,
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    zIndex: 0, // מבטיח שהמפה תהיה ברקע
  };
    
  return (
    
    <div style={mapStyle}>
      <MapContainer
        center={[32.0853, 34.7818]} // תל אביב כמרכז
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <HeatmapLayer /> {/* שכבת החום נוספת אוטומטית */}
      </MapContainer>
    </div>
  );
};

export default Heatmap;
