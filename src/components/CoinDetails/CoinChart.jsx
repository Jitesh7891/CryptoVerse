// Import necessary dependencies and components
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Baseurl } from "../baseUrl";
import { useParams } from "react-router-dom";

// Import Chart.js modules for rendering line charts
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Import custom components and styles
import Loader from "../Loader";
import "./CoinChart.css";

// Register Chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CoinChart = ({ currency = "usd" }) => {
  // Define state variables
  const [chartData, setChartData] = useState([]); // Stores fetched chart data
  const { id } = useParams(); // Retrieves `id` from URL parameters
  const [days, setDays] = useState(1); // Time period for chart data (1 day, 7 days, etc.)
  const [isMobile, setIsMobile] = useState(false); // Tracks if the device is mobile

  // Fetch chart data from the API
  const CoinChartData = async () => {
    try {
      const { data } = await axios.get(
        `${Baseurl}/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`
      );
      setChartData(data.prices);
    } catch (error) {
      console.error("Error fetching chart data:", error.message);
    }
  };

  // Detect if the user is on a mobile device
  const detectMobile = () => {
    setIsMobile(window.innerWidth <= 768); // Set `isMobile` to true for screen width <= 768px
  };

  // Set up event listener for screen resizing
  useEffect(() => {
    detectMobile(); // Initial detection
    window.addEventListener("resize", detectMobile); // Listen for screen resize
    return () => window.removeEventListener("resize", detectMobile); // Clean up listener
  }, []);

  // Fetch chart data when dependencies (currency, id, or days) change
  useEffect(() => {
    CoinChartData();
  }, [currency, id, days]);

  // Filter data points to optimize chart rendering for mobile and desktop views
  const filteredData = isMobile
    ? chartData.filter((_, index) => index % Math.ceil(chartData.length / 60) === 0) // Mobile: Max 60 points
    : chartData.filter((_, index) => index % Math.ceil(chartData.length / 300) === 0); // Desktop: Max 300 points

  // Prepare data for Chart.js
  const myData = {
    labels: filteredData.map((value) => {
      const date = new Date(value[0]);
      const hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const isPM = hours >= 12;

      // Format time for daily data, or show date for longer periods
      const time = isPM
        ? `${hours === 12 ? 12 : hours - 12}:${minutes} PM`
        : `${hours === 0 ? 12 : hours}:${minutes} AM`;

      return days === 1 ? time : date.toLocaleDateString();
    }),

    datasets: [
      {
        label: `Price in Past ${days} Days in ${currency.toUpperCase()}`,
        data: filteredData.map((value) => value[1]), // Use only price values
        borderColor: "#9823db", // Line color
        borderWidth: 2, // Line thickness
      },
    ],
  };

  // Chart.js options for customizing the chart appearance
  const options = {
    maintainAspectRatio: true,
    responsive: true,
    elements: {
      point: {
        radius: 1, // Size of data points
      },
    },
    plugins: {
      legend: {
        labels: {
          font: {
            size: 12, // Font size for legend
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.2)", // Grid line color
        },
        ticks: {
          color: "#ffffff", // X-axis tick color
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.2)", // Grid line color
        },
        ticks: {
          color: "#ffffff", // Y-axis tick color
        },
      },
    },
  };

  return (
    <>
      {chartData.length === 0 ? (
        // Display loader while data is being fetched
        <Loader />
      ) : (
        <div className="chart-container">
          {/* Render line chart */}
          <Line className="chart" data={myData} options={options} />
          {/* Time period selection buttons */}
          <div
            className="btn"
            style={{
              marginTop: "30px",
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <button onClick={() => setDays(1)}>Daily</button>
            <button onClick={() => setDays(7)}>Weekly</button>
            <button onClick={() => setDays(30)}>Monthly</button>
            <button onClick={() => setDays(365)}>Yearly</button>
          </div>
        </div>
      )}
    </>
  );
};

export default CoinChart;
