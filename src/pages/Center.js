import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

const API_BASE = "http://localhost/backend/api/v1";

function Center() {
    const [centers, setCenters] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] = useState(false);
    const [centerName, setCenterName] = useState("");

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const getToken = () => {
        const user = JSON.parse(localStorage.getItem("user") || "null");

        return (
            localStorage.getItem("token") ||
            localStorage.getItem("auth_token") ||
            localStorage.getItem("access_token") ||
            user?.token ||
            user?.auth_token ||
            ""
        );
    };

    const getHeaders = () => {
        const token = getToken();

        return {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };
    };

    const fetchCenters = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_BASE}/get_centers.php`,
                {
                    method: "GET",
                    headers: getHeaders(),
                }
            );

            const result = await response.json();

            if (!response.ok || result.status !== "success") {
                throw new Error(
                    result.message || "Unable to load centers."
                );
            }

            setCenters(result.data || []);
        } catch (err) {
            console.error("Center loading error:", err);
            setError(err.message || "Unable to load centers.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCenters();
    }, []);

    const handleAddCenter = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        const name = centerName.trim();

        if (!name) {
            setError("Please enter center name.");
            return;
        }

        try {
            setSaving(true);

            const response = await fetch(
                `${API_BASE}/save_master_data.php`,
                {
                    method: "POST",
                    headers: getHeaders(),
                    body: JSON.stringify({
                        type: "center",
                        name: name,
                    }),
                }
            );

            const result = await response.json();

            if (!response.ok || result.status !== "success") {
                throw new Error(
                    result.message || "Unable to add center."
                );
            }

            setCenterName("");
            setShowForm(false);
            setSuccess("Center added successfully.");

            await fetchCenters();
        } catch (err) {
            console.error("Add center error:", err);
            setError(err.message || "Unable to add center.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="dashboard-container">

            <Sidebar />

            <main className="main-content">

                {/* PAGE HEADER */}
                <div className="dashboard-topbar">

                    <div>
                        <h2>Centers</h2>

                        <p>
                            Manage health centers registered in the system
                        </p>
                    </div>

                    <button
                        type="button"
                        className="outline-btn"
                        onClick={() => {
                            setShowForm(!showForm);
                            setError("");
                            setSuccess("");
                        }}
                    >
                        {showForm ? "Cancel" : "+ Add Center"}
                    </button>

                </div>

                {/* SUCCESS MESSAGE */}
                {success && (
                    <div
                        style={{
                            marginBottom: "15px",
                            padding: "11px 14px",
                            borderRadius: "7px",
                            background: "#e8f7f0",
                            border: "1px solid #bde8d2",
                            color: "#16845f",
                            fontSize: "12px",
                        }}
                    >
                        {success}
                    </div>
                )}

                {/* ERROR MESSAGE */}
                {error && (
                    <div
                        style={{
                            marginBottom: "15px",
                            padding: "11px 14px",
                            borderRadius: "7px",
                            background: "#fff0f0",
                            border: "1px solid #f1c4c4",
                            color: "#c0392b",
                            fontSize: "12px",
                        }}
                    >
                        {error}
                    </div>
                )}

                {/* ADD CENTER FORM */}
                {showForm && (
                    <div
                        className="dashboard-panel"
                        style={{
                            marginBottom: "20px",
                            padding: "20px",
                        }}
                    >

                        <div style={{ marginBottom: "15px" }}>
                            <h5
                                style={{
                                    margin: 0,
                                    color: "#172033",
                                    fontSize: "16px",
                                }}
                            >
                                Add New Center
                            </h5>

                            <p
                                style={{
                                    margin: "5px 0 0",
                                    color: "#8a93a3",
                                    fontSize: "11px",
                                }}
                            >
                                Enter the name of the health center.
                            </p>
                        </div>

                        <form onSubmit={handleAddCenter}>

                            <div style={{ marginBottom: "15px" }}>

                                <label
                                    style={{
                                        display: "block",
                                        marginBottom: "7px",
                                        color: "#4a5362",
                                        fontSize: "12px",
                                        fontWeight: 600,
                                    }}
                                >
                                    Center Name
                                </label>

                                <input
                                    type="text"
                                    value={centerName}
                                    onChange={(e) =>
                                        setCenterName(e.target.value)
                                    }
                                    placeholder="Enter center name"
                                    style={{
                                        width: "100%",
                                        padding: "10px 12px",
                                        border: "1px solid #dfe4eb",
                                        borderRadius: "7px",
                                        fontSize: "12px",
                                        outline: "none",
                                    }}
                                />

                            </div>

                            <button
                                type="submit"
                                className="outline-btn"
                                disabled={saving}
                            >
                                {saving ? "Saving..." : "Save Center"}
                            </button>

                        </form>

                    </div>
                )}

                {/* CENTER TABLE */}
                <div className="dashboard-panel">

                    <div className="panel-header">

                        <div>
                            <h5>Registered Centers</h5>

                            <p>
                                Centers currently available in the database
                            </p>
                        </div>

                        <span
                            style={{
                                color: "#8a93a3",
                                fontSize: "11px",
                            }}
                        >
                            {centers.length}{" "}
                            {centers.length === 1
                                ? "center"
                                : "centers"}
                        </span>

                    </div>

                    <div className="table-responsive">

                        <table className="dashboard-table">

                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Center Name</th>
                                </tr>
                            </thead>

                            <tbody>

                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan="2"
                                            style={{
                                                textAlign: "center",
                                                padding: "25px",
                                                color: "#8a93a3",
                                            }}
                                        >
                                            Loading centers...
                                        </td>
                                    </tr>
                                ) : centers.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="2"
                                            style={{
                                                textAlign: "center",
                                                padding: "25px",
                                                color: "#8a93a3",
                                            }}
                                        >
                                            No Centers Found
                                        </td>
                                    </tr>
                                ) : (
                                    centers.map((center) => (
                                        <tr key={center.id}>

                                            <td>
                                                {center.id}
                                            </td>

                                            <td
                                                style={{
                                                    fontWeight: 600,
                                                    color: "#172033",
                                                }}
                                            >
                                                {center.name}
                                            </td>

                                        </tr>
                                    ))
                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default Center;