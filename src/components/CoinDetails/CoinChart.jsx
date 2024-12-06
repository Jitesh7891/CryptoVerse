import React, { useState, useEffect } from "react";
import axios from "axios";
import { Baseurl } from "../baseUrl";
import { useParams } from "react-router-dom";
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
import Loader from "../Loader";
import "./CoinChart.css";

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
  const [chartData, setChartData] = useState([]);
  const { id } = useParams();
  const [days, setDays] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

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

  // Detect screen size
  const detectMobile = () => {
    setIsMobile(window.innerWidth <= 768); // Set true for screen width <= 768px
  };

  useEffect(() => {
    detectMobile();
    window.addEventListener("resize", detectMobile); // Add listener for screen resize
    return () => window.removeEventListener("resize", detectMobile); // Clean up listener
  }, []);

  useEffect(() => {
    CoinChartData();
  }, [currency, id, days]);

  // Apply filtering only for mobile
  const filteredData = isMobile
    ? chartData.filter((_, index) => index % Math.ceil(chartData.length / 60) === 0) // Sample up to 60 points for mobile
    : chartData.filter((_, index) => index % Math.ceil(chartData.length / 300) === 0) // Sample up to 300 points for desktop

  const myData = {
    labels: filteredData.map((value) => {
      const date = new Date(value[0]);
      const hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const isPM = hours >= 12;

      const time = isPM
        ? `${hours === 12 ? 12 : hours - 12}:${minutes} PM`
        : `${hours === 0 ? 12 : hours}:${minutes} AM`;

      return days === 1 ? time : date.toLocaleDateString();
    }),

    datasets: [
      {
        label: `Price in Past ${days} Days in ${currency.toUpperCase()}`,
        data: filteredData.map((value) => value[1]),
        borderColor: "#9823db",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    maintainAspectRatio: true,
    responsive: true,
    elements: {
      point: {
        radius: 1,
      },
    },
    plugins: {
      legend: {
        labels: {
          font: {
            size: 12,
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.2)", 
        },
        ticks: {
          color: "#ffffff", 
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.2)", 
        },
        ticks: {
          color: "#ffffff", 
        },
      },
    },
  };

  return (
    <>
      {chartData.length === 0 ? (
        <Loader />
      ) : (
        <div className="chart-container">
          <Line className="chart" data={myData} options={options} />
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
