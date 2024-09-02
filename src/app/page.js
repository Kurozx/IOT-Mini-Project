"use client";
import React, { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./Dashboard.module.css";

export const dynamic = "force-dynamic";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [lastData, setLastData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [attackCount, setAttackCount] = useState(null);
  const [command, setCommand] = useState("");

  async function fetchLastData() {
    try {
      const res = await fetch("/api/lastestData");
      const data = await res.json();
      if (Array.isArray(data)) {
        setLastData(data);
      } else {
        console.error("Expected an array but received:", data);
        setLastData([]); // กำหนดค่าเป็นอาร์เรย์ว่างหากไม่เป็นอาร์เรย์
      }
      console.log("Latest Data:", data);
    } catch (error) {
      console.error("Error fetching latest data:", error);
      setLastData([]); // กำหนดค่าเป็นอาร์เรย์ว่างในกรณีที่เกิดข้อผิดพลาด
    }
  }

  async function fetchAllData() {
    try {
      const res = await fetch("/api/alldata");
      const data = await res.json();
      setAllData(data);
      console.log("All Data:", data);
    } catch (error) {
      console.error("Error fetching all data:", error);
    }
  }

  async function fetchAttackCount() {
    try {
      const res = await fetch("/api/attackCount");
      const data = await res.json();
      setAttackCount(data.att);
      console.log("Attack Count:", data.att);
    } catch (error) {
      console.error("Error fetching attack count:", error);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const res = await fetch("/api/control", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ command }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Command sent successfully");
      } else {
        alert(`Failed to send command: ${data.error}`);
      }
    } catch (error) {
      console.error("Error sending command:", error);
      alert("Error sending command");
    }
  }

  const chartData1 = lastData.length > 0 ? {
    labels: ["LDR", "VR"],
    datasets: [
      {
        label: "LDR",
        data: lastData.map((dataPoint) => dataPoint.ldr),
        backgroundColor: "rgba(255, 159, 64, 0.6)", // สีส้ม
        borderColor: "rgba(255, 159, 64, 1)", // สีส้มเข้มสำหรับขอบ
        pointStyle: "circle",
        pointRadius: 6,
        pointBackgroundColor: "rgba(255, 159, 64, 0.6)", // สีส้ม
        pointBorderColor: "rgba(255, 159, 64, 1)", // สีส้มเข้มสำหรับขอบ
      },
      {
        label: "VR",
        data: lastData.map((dataPoint) => dataPoint.vr),
        backgroundColor: "rgba(255, 205, 86, 0.6)", // สีเหลือง
        borderColor: "rgba(255, 205, 86, 1)", // สีเหลืองเข้มสำหรับขอบ
        pointStyle: "circle",
        pointRadius: 6,
        pointBackgroundColor: "rgba(255, 205, 86, 0.6)", // สีเหลือง
        pointBorderColor: "rgba(255, 205, 86, 1)", // สีเหลืองเข้มสำหรับขอบ
      },
    ],
  } : null;

  const chartData2 = lastData.length > 0 ? {
    labels: ["Temperature", "Distance"],
    datasets: lastData.map((dataPoint, index) => ({
      label: `Data Point ${index + 1}`,
      data: [dataPoint.temp, dataPoint.distance],
      backgroundColor: [
        "rgba(255, 159, 64, 0.6)",
        "rgba(255, 99, 132, 0.6)",
      ],
    })),
  } : null;

  const lineChartData1 = allData.length > 0 ? {
    labels: allData.map((dataPoint) =>
      new Date(dataPoint.date).toLocaleString("th-TH", {
        timeZone: "Asia/Bangkok",
        dateStyle: "short",
        timeStyle: "short",
      })
    ),
    datasets: [
      {
        label: "LDR",
        data: allData.map((dataPoint) => dataPoint.ldr),
        fill: false,
        borderColor: "rgba(75, 192, 192, 0.6)",
        tension: 0.1,
      },
      {
        label: "VR",
        data: allData.map((dataPoint) => dataPoint.vr),
        fill: false,
        borderColor: "rgba(153, 102, 255, 0.6)",
        tension: 0.1,
      },
    ],
  } : null;

  const lineChartData2 = allData.length > 0 ? {
    labels: allData.map((dataPoint) =>
      new Date(dataPoint.date).toLocaleString("th-TH", {
        timeZone: "Asia/Bangkok",
        dateStyle: "short",
        timeStyle: "short",
      })
    ),
    datasets: [
      {
        label: "Temperature",
        data: allData.map((dataPoint) => dataPoint.temp),
        fill: false,
        borderColor: "rgba(255, 159, 64, 0.6)",
        tension: 0.1,
      },
      {
        label: "Distance",
        data: allData.map((dataPoint) => dataPoint.distance),
        fill: false,
        borderColor: "rgba(255, 99, 132, 0.6)",
        tension: 0.1,
      },
    ],
  } : null;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Latest Sensor Data Visualization",
      },
    },
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Sensor Data Trends Over Time",
      },
    },
  };

  useEffect(() => {
    fetchLastData();
    fetchAllData();
    fetchAttackCount();

    const intervalId = setInterval(() => {
      fetchLastData();
      fetchAllData();
      fetchAttackCount();
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={`${styles.dashboard} container`}>
      <h1 className={`${styles.heading} text-center my-4`}>
        Dashboard
      </h1>
      <ul className="nav nav-tabs" id="chartTabs" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="trend-ldr-vr-tab"
            data-bs-toggle="tab"
            data-bs-target="#trend-ldr-vr"
            type="button"
            role="tab"
            aria-controls="trend-ldr-vr"
            aria-selected="false"
          >
            LDR and VR Trends
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="trend-temp-distance-tab"
            data-bs-toggle="tab"
            data-bs-target="#trend-temp-distance"
            type="button"
            role="tab"
            aria-controls="trend-temp-distance"
            aria-selected="false"
          >
            Temperature and Distance Trends
          </button>
        </li>
      </ul>
      <div className="tab-content" id="chartTabsContent">
        <div
          className="tab-pane fade show active"
          id="ldr-vr"
          role="tabpanel"
          aria-labelledby="ldr-vr-tab"
        >
          {/* Placeholder for LDR and VR chart */}
        </div>
        <div
          className="tab-pane fade"
          id="temp-distance"
          role="tabpanel"
          aria-labelledby="temp-distance-tab"
        >
          {lastData.length > 0 && chartData2 ? (
            <div className={styles.chartContainer}>
              <h2>Temperature and Distance</h2>
              <Bar data={chartData2} options={chartOptions} />
            </div>
          ) : (
            <p>No data available for Temperature and Distance chart</p>
          )}
        </div>
        <div
          className="tab-pane fade"
          id="trend-ldr-vr"
          role="tabpanel"
          aria-labelledby="trend-ldr-vr-tab"
        >
          {allData.length > 0 && lineChartData1 ? (
            <div className={styles.chartContainer}>
              <h2>LDR and VR Trends</h2>
              <Line data={lineChartData1} options={lineChartOptions} />
            </div>
          ) : (
            <p>No data available for the LDR and VR line chart</p>
          )}
        </div>
        <div
          className="tab-pane fade"
          id="trend-temp-distance"
          role="tabpanel"
          aria-labelledby="trend-temp-distance-tab"
        >
          {allData.length > 0 && lineChartData2 ? (
            <div className={styles.chartContainer}>
              <h2>Temperature and Distance Trends</h2>
              <Line data={lineChartData2} options={lineChartOptions} />
            </div>
          ) : (
            <p>No data available for the Temperature and Distance line chart</p>
          )}
        </div>
      </div>

      {/* NeoPixel Control Form */}
      <div className="container my-4">
        <h2>NeoPixel Control</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="command" className="form-label">
              Command
            </label>
            <select
              id="command"
              className="form-select"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
            >
              <option value="RGB_ON">RGB_ON</option>
              <option value="OFF">OFF</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">
            Send Command
          </button>
        </form>
      </div>
    </div>
  );
}
