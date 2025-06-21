// components/PriceChart.js
import React from "react";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function PriceChart({ history }) {
  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Today"],
    datasets: [
      {
        label: "Price History ($)",
        data: history,
        fill: false,
        borderColor: "#3b82f6",
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: false,
      },
    },
  };

  return (
    <div style={{ maxWidth: "300px", margin: "10px auto" }}>
      <Line data={data} options={options} />
    </div>
  );
}


// utils/score.js
export function calculateScore(price) {
  if (price <= 0) return 0;
  const maxPrice = 100;
  let score = Math.max(0, 100 - (price / maxPrice) * 100);
  return Math.round(score);
}
