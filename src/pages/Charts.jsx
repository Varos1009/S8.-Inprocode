import React from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from "chart.js";
import { useData } from "../context/crudContext";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const Charts = ( ) => {

    const {events} = useData();

    // 📊 Events Per Hour (Bar Chart)
    const getHourlyData = () => {
        const hourlyCounts = new Array(24).fill(0);

        events.forEach(event => {
            const hour = new Date(event.date).getHours();
            hourlyCounts[hour]++;
        });

        return {
            labels: [...Array(24).keys()].map(h => `${h}:00`),
            datasets: [
                {
                    label: "Number of Events",
                    data: hourlyCounts,
                    backgroundColor: "rgba(54, 162, 235, 0.6)",
                    borderColor: "rgba(54, 162, 235, 1)",
                    borderWidth: 1,
                },
            ],
        };
    };

    // 🏆 Events Per Competition (Pie Chart)
    const getCompetitionData = () => {
        const competitionCounts = {};

        events.forEach(event => {
            const competition = event.competition || "Unknown";
            competitionCounts[competition] = (competitionCounts[competition] || 0) + 1;
        });

        return {
            labels: Object.keys(competitionCounts),
            datasets: [
                {
                    data: Object.values(competitionCounts),
                    backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#9966FF"],
                    borderWidth: 1,
                },
            ],
        };
    };

    return (
        <div className="charts-container">
            {/* Bar Chart */}
            <div className="chart-box">
                <h3>📊 Events Per Hour</h3>
                <Bar data={getHourlyData()} options={{ responsive: true, plugins: { legend: { position: "bottom" } } }} />
            </div>

            {/* Pie Chart */}
            <div className="chart-box">
                <h3>🏆 Events Per Competition</h3>
                <Pie data={getCompetitionData()} options={{ responsive: true, plugins: { legend: { position: "bottom" } } }} />
            </div>
        </div>
    );
};

export default Charts;
