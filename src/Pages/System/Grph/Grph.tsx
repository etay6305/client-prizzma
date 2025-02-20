import React, { useState, useEffect } from 'react';
import "./Grph.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css'; // ייבוא עיצוב בסיסי
import { getTypographyUtilityClass } from '@mui/material';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Transmitter {
  name: string;
  allocatedRadius: number;
  smalles1200: number;
  bigger1201: number;
}

function BarChart() {
  const [alltransmitteronmap, setalltransmitteronmap] = useState<Transmitter[]>([]);
  const [size, setSize] = useState({ width: 300, height: 200 });
  const [graphType, setGraphType] = useState<'all' | 'summary'>('all');
  useEffect(() => {
    const getGraph = async () => {
      try {
        const response = await axios.get("http://localhost:5000/show-all-transmitter-on-map");
        console.log("Full response:", response.data);
        const arr = response.data;
        // מניחים שהשרת מחזיר אובייקט עם שדה data שהוא מערך
        if (Array.isArray(arr)) {
          setalltransmitteronmap(response.data);
        } else {
          console.error("Data from server is not an array or missing 'data' field.");
        }
      } catch(err) {
        console.error("Error fetching data:", err);
      }
    };
    getGraph();
  }, []);

  // למנוע map על ערך לא-מערך
  if (!Array.isArray(alltransmitteronmap)) {
    return <div>Loading or invalid data...</div>;
  }

  const count1200 = alltransmitteronmap.filter(item => item.allocatedRadius <= 1200).length;
  const count1201 = alltransmitteronmap.filter(item => item.allocatedRadius > 1200).length;

  const chartData1 = {
    labels: alltransmitteronmap.map(item => item.name),
    datasets: [
      {
        label: 'Allocated Radius',
        data: alltransmitteronmap.map(item => item.allocatedRadius),
        backgroundColor: '#36a2eb',
      },
    ],
  };

  const chartData2 = {
    labels:  ['≤ 1200', '> 1200'],
    datasets: [
      {
        label: 'Allocated Radius',
        data: [count1200, count1201],
        backgroundColor: ['#FF6384', '#36A2EB'],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // מאפשר לנו לשלוט על גודל הקונטיינר ידנית
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: 'גרף עמודות - Allocated Radius',
      },
    },
  };

  return (
    <ResizableBox
    width={size.width}
    height={size.height}
    minConstraints={[100, 100]}
    maxConstraints={[400, 400]}
    resizeHandles={['se']}
    onResizeStop={(_, data) => setSize({ width: data.size.width, height: data.size.height })}
    style={{
      position: 'fixed',
      right: '20px',
      bottom: '55px',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(5px)',
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '10px',
      zIndex: 9999,
    }}
  >
    <div style={{ width: '100%', height: '100%' }}>
      <Bar data={graphType === 'all' ? chartData1: chartData2} options={chartOptions} />
      <select className="chooseAgraph" onChange={(e) => setGraphType(e.target.value as 'all' | 'summary')}>
       <option value="all">📊 הצגת כל המשדרים</option>
       <option value="summary">📈 כמות המשדרים לפי רדיוס</option>
      </select>
    </div>
  </ResizableBox>
  );
}

export default BarChart;
