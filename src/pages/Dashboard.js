import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function Dashboard() {
    const navigate = useNavigate();

    const [families, setFamilies] = useState([]);
    const [loading, setLoading] = useState(true);

    const [stats, setStats] = useState({
        families: 0,
        members: 0,
        villages: 0,
        centers: 0,
    });

    const [diseaseStats, setDiseaseStats] = useState({
        totalCases: 0,
        commonDisease: "-",
        diseaseTypes: 0,
        diseases: [],
    });

    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            /*
             * =====================================================
             * 1. GET ALL FAMILIES
             * =====================================================
             *
             * We are using the existing get_families.php.
             *
             * A larger limit is used so that dashboard statistics
             * can be calculated from all available families.
             */

            const response = await axios.get(
                "http://localhost/backend/api/v1/get_families.php?page=1&limit=10000",
                config
            );

            console.log("Dashboard Families API:", response.data);

            if (response.data.status !== "success") {
                console.error("Unable to load families");
                return;
            }

            const allFamilies = response.data.data || [];

            /*
             * =====================================================
             * 2. CALCULATE BASIC STATISTICS
             * =====================================================
             */

            const totalFamilies =
                Number(response.data.pagination?.total_records) ||
                allFamilies.length;

            const totalMembers = allFamilies.reduce(
                (total, family) =>
                    total + Number(family.total_members || 0),
                0
            );

            /*
             * Unique villages
             */

            const uniqueVillages = new Set(
                allFamilies
                    .map((family) => family.village_name)
                    .filter(Boolean)
            );

            /*
             * =====================================================
             * 3. LOAD FAMILY DETAILS
             * =====================================================
             *
             * Existing get_family_details.php gives:
             *
             * - center_id
             * - diseases
             * - members
             *
             * No new API is required.
             */

            const familyDetailsRequests = allFamilies.map(
                async (family) => {
                    try {
                        const familyId = family.family_id;

                        const detailResponse = await axios.get(
                            `http://localhost/backend/api/v1/get_family_details.php?id=${familyId}`,
                            config
                        );

                        if (
                            detailResponse.data.status ===
                            "success"
                        ) {
                            return detailResponse.data.data;
                        }

                        return null;
                    } catch (error) {
                        console.error(
                            `Unable to load family ${family.family_id}`,
                            error
                        );

                        return null;
                    }
                }
            );

            const familyDetails =
                await Promise.all(familyDetailsRequests);

            /*
             * =====================================================
             * 4. CALCULATE UNIQUE CENTERS
             * =====================================================
             */

            const uniqueCenters = new Set();

            familyDetails.forEach((detail) => {
                if (!detail) return;

                const family = detail.family;

                if (family?.center_id) {
                    uniqueCenters.add(
                        Number(family.center_id)
                    );
                }
            });

            /*
             * =====================================================
             * 5. DISEASE SUMMARY
             * =====================================================
             */

            const diseaseCountMap = {};

            familyDetails.forEach((detail) => {
                if (!detail) return;

                const members = detail.members || [];
                const diseases = detail.diseases || [];

                members.forEach((member) => {
                    const diseaseIds =
                        member.disease_ids || [];

                    diseaseIds.forEach((diseaseId) => {
                        const disease = diseases.find(
                            (item) =>
                                Number(item.id) ===
                                Number(diseaseId)
                        );

                        if (!disease) return;

                        const diseaseName =
                            disease.name;

                        if (
                            !diseaseCountMap[
                                diseaseName
                            ]
                        ) {
                            diseaseCountMap[
                                diseaseName
                            ] = 0;
                        }

                        diseaseCountMap[
                            diseaseName
                        ] += 1;
                    });
                });
            });

            /*
             * Convert disease object to array
             */

            const diseaseArray = Object.entries(
                diseaseCountMap
            )
                .map(([name, count]) => ({
                    name,
                    count,
                }))
                .sort(
                    (a, b) =>
                        b.count - a.count
                );

            const totalDiseaseCases =
                diseaseArray.reduce(
                    (total, disease) =>
                        total +
                        Number(disease.count),
                    0
                );

            const mostCommonDisease =
                diseaseArray.length > 0
                    ? diseaseArray[0].name
                    : "-";

            /*
             * =====================================================
             * 6. UPDATE DASHBOARD STATS
             * =====================================================
             */

            setStats({
                families: totalFamilies,
                members: totalMembers,
                villages: uniqueVillages.size,
                centers: uniqueCenters.size,
            });

            /*
             * =====================================================
             * 7. UPDATE DISEASE STATS
             * =====================================================
             */

            setDiseaseStats({
                totalCases: totalDiseaseCases,
                commonDisease:
                    mostCommonDisease,
                diseaseTypes:
                    diseaseArray.length,
                diseases: diseaseArray,
            });

            /*
             * =====================================================
             * 8. RECENT FAMILIES
             * =====================================================
             *
             * API already returns newest families first.
             */

            setFamilies(allFamilies.slice(0, 5));
        } catch (error) {
            console.error(
                "Dashboard Error:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    /*
     * =========================================================
     * VIEW FAMILY
     * =========================================================
     */

    const handleViewFamily = (family) => {
        navigate("/family-details", {
            state: {
                familyId: family.family_id,
            },
        });
    };

    /*
     * =========================================================
     * VIEW ALL FAMILIES
     * =========================================================
     */

    const handleViewAll = () => {
        navigate("/families");
    };

    /*
     * =========================================================
     * DISEASE DOT COLOR
     * =========================================================
     */

    const getDiseaseDotClass = (index) => {
        const classes = [
            "blue-dot",
            "red-dot",
            "orange-dot",
            "teal-dot",
            "purple-dot",
        ];

        return classes[index % classes.length];
    };

    /*
     * =========================================================
     * LOADING
     * =========================================================
     */

    if (loading) {
        return (
            <div className="dashboard-container">

                <Sidebar />

                <main className="main-content">

                    <div className="dashboard-topbar">
                        <div>
                            <h2>Welcome back, Operator</h2>
                            <p>
                                Here's what's happening in
                                your health survey system.
                            </p>
                        </div>
                    </div>

                    <div
                        style={{
                            padding: "40px",
                            textAlign: "center",
                        }}
                    >
                        Loading dashboard...
                    </div>

                </main>

            </div>
        );
    }

    return (
        <div className="dashboard-container">

            {/* =====================================================
                MOBILE TOP BAR
            ===================================================== */}

            <div className="mobile-topbar">

                <button
                    className="mobile-menu-btn"
                    onClick={() =>
                        setMobileSidebarOpen(true)
                    }
                >
                    ☰
                </button>

                <h5>
                    Government Health Survey System
                </h5>

            </div>

            {/* =====================================================
                MOBILE SIDEBAR OVERLAY
            ===================================================== */}

            {mobileSidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() =>
                        setMobileSidebarOpen(false)
                    }
                />
            )}

            {/* =====================================================
                SIDEBAR
            ===================================================== */}

            <div
                className={
                    mobileSidebarOpen
                        ? "sidebar sidebar-mobile-open"
                        : "sidebar"
                }
            >
                <div className="sidebar-header">

                    <div className="sidebar-logo">
                        🏥
                    </div>

                    <div>
                        <h4>
                            Government Health
                        </h4>

                        <span>
                            Survey System
                        </span>
                    </div>

                    <button
                        className="sidebar-close-btn"
                        onClick={() =>
                            setMobileSidebarOpen(false)
                        }
                    >
                        ×
                    </button>

                </div>

                <button
                    className="sidebar-btn sidebar-active"
                    onClick={() => {
                        navigate("/dashboard");
                        setMobileSidebarOpen(false);
                    }}
                >
                    🏠
                    <span>Dashboard</span>
                </button>

                <button
                    className="sidebar-btn"
                    onClick={() => {
                        navigate("/families");
                        setMobileSidebarOpen(false);
                    }}
                >
                    👥
                    <span>Families</span>
                </button>

                <button
                    className="sidebar-btn"
                    onClick={() =>
                        setMobileSidebarOpen(false)
                    }
                >
                    ▦
                    <span>Master Data</span>
                    <span style={{ marginLeft: "auto" }}>
                        ▼
                    </span>
                </button>

                <button
                    className="sidebar-btn"
                    onClick={() => {
                        navigate("/profile");
                        setMobileSidebarOpen(false);
                    }}
                >
                    👤
                    <span>Profile</span>
                </button>

            </div>

            {/* =====================================================
                MAIN CONTENT
            ===================================================== */}

            <main className="main-content">

                {/* =================================================
                    TOP BAR
                ================================================= */}

                <div className="dashboard-topbar">

                    <div>
                        <h2>
                            Welcome back, Operator
                        </h2>

                        <p>
                            Here's what's happening in
                            your health survey system.
                        </p>
                    </div>

                    <div className="dashboard-user">

                        <div className="notification-icon">
                            🔔
                        </div>

                        <div className="user-avatar">
                            O
                        </div>

                        <div className="user-info">

                            <strong>
                                Operator
                            </strong>

                            <small>
                                Health Survey
                            </small>

                        </div>

                    </div>

                </div>

                {/* =================================================
                    SUMMARY CARDS
                ================================================= */}

                <div className="dashboard-cards">

                    {/* Families */}

                    <div className="dashboard-card">

                        <div className="card-icon blue">
                            👨‍👩‍👧‍👦
                        </div>

                        <div>

                            <span>
                                Total Families
                            </span>

                            <h3>
                                {stats.families}
                            </h3>

                            <small className="success-text">
                                ↑ Registered families
                            </small>

                        </div>

                    </div>

                    {/* Members */}

                    <div className="dashboard-card">

                        <div className="card-icon green">
                            👥
                        </div>

                        <div>

                            <span>
                                Total Members
                            </span>

                            <h3>
                                {stats.members}
                            </h3>

                            <small className="success-text">
                                ↑ Registered members
                            </small>

                        </div>

                    </div>

                    {/* Villages */}

                    <div className="dashboard-card">

                        <div className="card-icon teal">
                            🏠
                        </div>

                        <div>

                            <span>
                                Total Villages
                            </span>

                            <h3>
                                {stats.villages}
                            </h3>

                            <small className="muted-text">
                                Registered villages
                            </small>

                        </div>

                    </div>

                    {/* Centers */}

                    <div className="dashboard-card">

                        <div className="card-icon orange">
                            🏥
                        </div>

                        <div>

                            <span>
                                Total Centers
                            </span>

                            <h3>
                                {stats.centers || "-"}
                            </h3>

                            <small className="muted-text">
                                Active centers
                            </small>

                        </div>

                    </div>

                </div>

                {/* =================================================
                    MAIN GRID
                ================================================= */}

                <div className="dashboard-grid">

                    {/* =================================================
                        RECENT FAMILIES
                    ================================================= */}

                    <div className="dashboard-panel">

                        <div className="panel-header">

                            <div>

                                <h5>
                                    Recent Families
                                </h5>

                                <p>
                                    Recently registered
                                    households
                                </p>

                            </div>

                            <button
                                className="outline-btn"
                                onClick={
                                    handleViewAll
                                }
                            >
                                View All
                            </button>

                        </div>

                        <div className="table-responsive">

                            <table className="dashboard-table">

                                <thead>

                                    <tr>

                                        <th>
                                            House No.
                                        </th>

                                        <th>
                                            Family No.
                                        </th>

                                        <th>
                                            Head of Family
                                        </th>

                                        <th>
                                            Village
                                        </th>

                                        <th>
                                            Members
                                        </th>

                                        <th>
                                            Action
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {families.length === 0 ? (

                                        <tr>

                                            <td
                                                colSpan="6"
                                                style={{
                                                    textAlign:
                                                        "center",
                                                }}
                                            >
                                                No families
                                                found.
                                            </td>

                                        </tr>

                                    ) : (

                                        families.map(
                                            (family) => (

                                                <tr
                                                    key={
                                                        family.family_id
                                                    }
                                                >

                                                    <td>
                                                        {
                                                            family.house_no ||
                                                            "-"
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            family.family_no ||
                                                            "-"
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            family.head_name ||
                                                            "-"
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            family.village_name ||
                                                            "-"
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            family.total_members ??
                                                            0
                                                        }
                                                    </td>

                                                    <td>

                                                        <button
                                                            className="table-view-btn"
                                                            onClick={() =>
                                                                handleViewFamily(
                                                                    family
                                                                )
                                                            }
                                                        >
                                                            View
                                                        </button>

                                                    </td>

                                                </tr>

                                            )
                                        )

                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                    {/* =================================================
                        DISEASE SUMMARY
                    ================================================= */}

                    <div className="dashboard-panel disease-summary">

                        <div className="panel-header">

                            <div>

                                <h5>
                                    Disease Summary
                                </h5>

                                <p>
                                    Health conditions
                                    recorded in the
                                    survey
                                </p>

                            </div>

                        </div>

                        {/* Total Disease Cases */}

                        <div className="disease-total">

                            <div className="disease-total-number">
                                {
                                    diseaseStats.totalCases ||
                                    0
                                }
                            </div>

                            <div>

                                <strong>
                                    Total Disease Cases
                                </strong>

                                <span>
                                    Registered cases
                                </span>

                            </div>

                        </div>

                        {/* Most Common Disease */}

                        <div className="disease-total">

                            <div className="disease-total-number">
                                🩺
                            </div>

                            <div>

                                <strong>
                                    Most Common Disease
                                </strong>

                                <span>
                                    {
                                        diseaseStats.commonDisease ||
                                        "-"
                                    }
                                </span>

                            </div>

                        </div>

                        {/* Disease Types */}

                        <div className="disease-total">

                            <div className="disease-total-number">
                                {
                                    diseaseStats.diseaseTypes ||
                                    0
                                }
                            </div>

                            <div>

                                <strong>
                                    Disease Types
                                </strong>

                                <span>
                                    Different disease
                                    categories
                                </span>

                            </div>

                        </div>

                        {/* Disease List */}

                        {diseaseStats.diseases.length >
                            0 && (

                            <div className="disease-list">

                                {diseaseStats.diseases
                                    .slice(0, 5)
                                    .map(
                                        (
                                            disease,
                                            index
                                        ) => (

                                            <div
                                                className="disease-item"
                                                key={
                                                    disease.name
                                                }
                                            >

                                                <div className="disease-name">

                                                    <span
                                                        className={`disease-dot ${getDiseaseDotClass(
                                                            index
                                                        )}`}
                                                    />

                                                    {
                                                        disease.name
                                                    }

                                                </div>

                                                <strong>
                                                    {
                                                        disease.count
                                                    }
                                                </strong>

                                            </div>

                                        )
                                    )}

                            </div>

                        )}

                    </div>

                </div>

                {/* =================================================
                    INFORMATION SECTION
                ================================================= */}

                <div className="dashboard-information">

                    <div>

                        <strong>
                            आरोग्य सर्वेक्षण प्रणाली
                        </strong>

                        <p>
                            कुटुंब आणि सदस्यांच्या
                            आरोग्यविषयक माहितीचे
                            व्यवस्थापन करण्यासाठी ही
                            प्रणाली वापरा.
                        </p>

                    </div>

                    <div className="system-status">

                        <span className="status-indicator" />

                        System Active

                    </div>

                </div>

            </main>

        </div>
    );
}

export default Dashboard;