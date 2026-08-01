import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Sidebar() {

    const navigate = useNavigate();
    const location = useLocation();

    const [showMasterMenu, setShowMasterMenu] = useState(false);

    return (

        <div className="sidebar">

            <h3 className="text-center mb-4">
                Health Survey
            </h3>

            <button
                className={`btn w-100 mb-3 ${location.pathname === "/dashboard"
                    ? "sidebar-active"
                    : "btn-outline-light"
                    }`}
                onClick={() => navigate("/dashboard")}
            >
                Dashboard
            </button>

            <button
                className={`btn w-100 mb-3 ${location.pathname === "/families"
                    ? "sidebar-active"
                    : "btn-outline-light"
                    }`}
                onClick={() => navigate("/families")}
            >
                Families
            </button>

            <button
                className="btn btn-outline-light w-100 mb-3"
                onClick={() => setShowMasterMenu(!showMasterMenu)}
            >
                {showMasterMenu ? "▼ Master Data" : "▶ Master Data"}
            </button>
            {showMasterMenu && (

                <div className="master-menu">

                    <button
                        className="btn btn-outline-light w-100 mb-2"
                        onClick={() => navigate("/center")}
                    >
                        Center
                    </button>

                    <button
                        className="btn btn-outline-light w-100 mb-2"
                        onClick={() => navigate("/sub-center")}
                    >
                        Sub Center
                    </button>

                    <button
                        className="btn btn-outline-light w-100 mb-3"
                        onClick={() => navigate("/village")}
                    >
                        Village
                    </button>

                </div>

            )}

            <button
                className={`btn w-100 mb-3 ${location.pathname === "/profile"
                        ? "sidebar-active"
                        : "btn-outline-light"
                    }`}
                onClick={() => navigate("/profile")}
            >
                Profile
            </button>


        </div>

    );
}

export default Sidebar;