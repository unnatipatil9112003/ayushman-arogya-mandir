import React from "react";
import Sidebar from "../components/Sidebar";
import "../styles/dashboard.css";

function Dashboard() {


    return (

        <div className="dashboard-container">

            <Sidebar />

            <div className="main-content">

                <h2 className="mb-4">Dashboard</h2>

                <div className="dashboard-cards">

                    <div className="dashboard-card">
                        <h5>Total Families</h5>
                        <h2>125</h2>
                    </div>

                    <div className="dashboard-card">
                        <h5>Total Members</h5>
                        <h2>542</h2>
                    </div>

                    <div className="dashboard-card">
                        <h5>Total Villages</h5>
                        <h2>18</h2>
                    </div>

                    <div className="dashboard-card">
                        <h5>Total Centers</h5>
                        <h2>5</h2>
                    </div>

                </div>

            </div>

        </div>

    );
}

export default Dashboard;