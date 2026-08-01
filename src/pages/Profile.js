import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/dashboard.css";

function Profile() {

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        navigate("/");
    };

    return (

        <div className="dashboard-container">

            <Sidebar />

            <div className="main-content">

                <h2>Profile</h2>

                <hr />

                <div className="card p-4">

                    <h5>User Profile</h5>

                    <p>Name : Admin User</p>

                    <p>Role : Admin</p>

                    <button
                        className="btn btn-danger mt-3"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </div>

        </div>

    );

}

export default Profile;