// import React, { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";

// function Sidebar() {

//     const navigate = useNavigate();
//     const location = useLocation();

//     const [showMasterMenu, setShowMasterMenu] = useState(false);

//     return (

//         <div className="sidebar">

//             <h3 className="text-center mb-4">
//                 Health Survey
//             </h3>

//             <button
//                 className={`btn w-100 mb-3 ${location.pathname === "/dashboard"
//                     ? "sidebar-active"
//                     : "btn-outline-light"
//                     }`}
//                 onClick={() => navigate("/dashboard")}
//             >
//                 Dashboard
//             </button>

//             <button
//                 className={`btn w-100 mb-3 ${location.pathname === "/families"
//                     ? "sidebar-active"
//                     : "btn-outline-light"
//                     }`}
//                 onClick={() => navigate("/families")}
//             >
//                 Families
//             </button>

//             <button
//                 className="btn btn-outline-light w-100 mb-3"
//                 onClick={() => setShowMasterMenu(!showMasterMenu)}
//             >
//                 {showMasterMenu ? "▼ Master Data" : "▶ Master Data"}
//             </button>
//             {showMasterMenu && (

//                 <div className="master-menu">

//                     <button
//                         className="btn btn-outline-light w-100 mb-2"
//                         onClick={() => navigate("/center")}
//                     >
//                         Center
//                     </button>

//                     <button
//                         className="btn btn-outline-light w-100 mb-2"
//                         onClick={() => navigate("/sub-center")}
//                     >
//                         Sub Center
//                     </button>

//                     <button
//                         className="btn btn-outline-light w-100 mb-3"
//                         onClick={() => navigate("/village")}
//                     >
//                         Village
//                     </button>

//                 </div>

//             )}

//             <button
//                 className={`btn w-100 mb-3 ${location.pathname === "/profile"
//                         ? "sidebar-active"
//                         : "btn-outline-light"
//                     }`}
//                 onClick={() => navigate("/profile")}
//             >
//                 Profile
//             </button>


//         </div>

//     );
// }

// export default Sidebar;

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Sidebar() {

    const navigate = useNavigate();
    const location = useLocation();

    const [showMasterMenu, setShowMasterMenu] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleNavigate = (path) => {
        navigate(path);
        setMobileOpen(false);
    };

    return (
        <>
            {/* Mobile Top Bar */}
            <div className="mobile-topbar">

                <button
                    className="mobile-menu-btn"
                    onClick={() => setMobileOpen(!mobileOpen)}
                >
                    ☰
                </button>

                <h5>Government Health Survey</h5>

            </div>

            {/* Mobile Overlay */}
            {mobileOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setMobileOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <div
                className={`sidebar ${
                    mobileOpen ? "sidebar-mobile-open" : ""
                }`}
            >

                <div className="sidebar-header">

                    <div className="sidebar-logo">
                        🏥
                    </div>

                    <div>
                        <h4>Government Health</h4>
                        <span>Survey System</span>
                    </div>

                    {/* Mobile Close */}
                    <button
                        className="sidebar-close-btn"
                        onClick={() => setMobileOpen(false)}
                    >
                        ×
                    </button>

                </div>

                {/* Dashboard */}
                <button
                    className={`sidebar-btn ${
                        location.pathname === "/dashboard"
                            ? "sidebar-active"
                            : ""
                    }`}
                    onClick={() => handleNavigate("/dashboard")}
                >
                    <span>⌂</span>
                    Dashboard
                </button>

                {/* Families */}
                <button
                    className={`sidebar-btn ${
                        location.pathname === "/families"
                            ? "sidebar-active"
                            : ""
                    }`}
                    onClick={() => handleNavigate("/families")}
                >
                    <span>👥</span>
                    Families
                </button>

                {/* Master Data */}
                <button
                    className="sidebar-btn"
                    onClick={() =>
                        setShowMasterMenu(!showMasterMenu)
                    }
                >
                    <span>▦</span>

                    Master Data

                    <span className="master-arrow">
                        {showMasterMenu ? "▲" : "▼"}
                    </span>

                </button>

                {showMasterMenu && (

                    <div className="master-menu">

                        <button
                            className="master-menu-btn"
                            onClick={() =>
                                handleNavigate("/center")
                            }
                        >
                            Center
                        </button>

                        <button
                            className="master-menu-btn"
                            onClick={() =>
                                handleNavigate("/sub-center")
                            }
                        >
                            Sub Center
                        </button>

                        <button
                            className="master-menu-btn"
                            onClick={() =>
                                handleNavigate("/village")
                            }
                        >
                            Village
                        </button>

                    </div>

                )}

                {/* Profile */}
                <button
                    className={`sidebar-btn ${
                        location.pathname === "/profile"
                            ? "sidebar-active"
                            : ""
                    }`}
                    onClick={() => handleNavigate("/profile")}
                >
                    <span>👤</span>
                    Profile
                </button>

            </div>
        </>
    );
}

export default Sidebar;


