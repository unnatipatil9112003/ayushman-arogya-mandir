import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

const API_BASE = "http://localhost/backend/api/v1";

function SubCenter() {
    const [centers, setCenters] = useState([]);
    const [subCenters, setSubCenters] = useState([]);

    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] = useState(false);

    const [selectedCenter, setSelectedCenter] = useState("");
    const [subCenterName, setSubCenterName] = useState("");

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

        return result.data || [];
    };

    const fetchSubCentersForCenter = async (center) => {
        const response = await fetch(
            `${API_BASE}/get_sub_centers.php?center_id=${center.id}`,
            {
                method: "GET",
                headers: getHeaders(),
            }
        );

        const result = await response.json();

        if (!response.ok || result.status !== "success") {
            throw new Error(
                result.message ||
                `Unable to load sub-centers for ${center.name}.`
            );
        }

        return (result.data || []).map((subCenter) => ({
            ...subCenter,
            center_id: center.id,
            center_name: center.name,
        }));
    };

    const fetchAllSubCenters = async () => {
        try {
            setLoading(true);
            setError("");

            const centerData = await fetchCenters();

            setCenters(centerData);

            if (centerData.length === 0) {
                setSubCenters([]);
                return;
            }

            const subCenterResults = await Promise.all(
                centerData.map(fetchSubCentersForCenter)
            );

            const combinedSubCenters =
                subCenterResults.flat();

            setSubCenters(combinedSubCenters);

        } catch (err) {
            console.error("Sub-center loading error:", err);

            setError(
                err.message ||
                "Unable to load sub-centers."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllSubCenters();
    }, []);

    const handleAddSubCenter = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        const name = subCenterName.trim();

        if (!selectedCenter) {
            setError("Please select a center.");
            return;
        }

        if (!name) {
            setError("Please enter sub-center name.");
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
                        type: "sub_center",
                        center_id: Number(selectedCenter),
                        name: name,
                    }),
                }
            );

            const result = await response.json();

            if (!response.ok || result.status !== "success") {
                throw new Error(
                    result.message ||
                    "Unable to add sub-center."
                );
            }

            setSelectedCenter("");
            setSubCenterName("");
            setShowForm(false);

            setSuccess(
                "Sub-Center added successfully."
            );

            await fetchAllSubCenters();

        } catch (err) {
            console.error(
                "Add sub-center error:",
                err
            );

            setError(
                err.message ||
                "Unable to add sub-center."
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="dashboard-container">

            <Sidebar />

            <main className="main-content">

                {/* HEADER */}
                <div className="dashboard-topbar">

                    <div>
                        <h2>Sub-Centers</h2>

                        <p>
                            Manage sub-centers linked to health centers
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
                        {showForm
                            ? "Cancel"
                            : "+ Add Sub-Center"}
                    </button>

                </div>

                {/* SUCCESS */}
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

                {/* ERROR */}
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

                {/* ADD FORM */}
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
                                Add New Sub-Center
                            </h5>

                            <p
                                style={{
                                    margin: "5px 0 0",
                                    color: "#8a93a3",
                                    fontSize: "11px",
                                }}
                            >
                                Select the parent center and enter
                                the sub-center name.
                            </p>

                        </div>

                        <form onSubmit={handleAddSubCenter}>

                            {/* CENTER */}
                            <div
                                style={{
                                    marginBottom: "15px",
                                }}
                            >

                                <label
                                    style={{
                                        display: "block",
                                        marginBottom: "7px",
                                        color: "#4a5362",
                                        fontSize: "12px",
                                        fontWeight: 600,
                                    }}
                                >
                                    Center
                                </label>

                                <select
                                    value={selectedCenter}
                                    onChange={(e) =>
                                        setSelectedCenter(
                                            e.target.value
                                        )
                                    }
                                    style={{
                                        width: "100%",
                                        padding: "10px 12px",
                                        border: "1px solid #dfe4eb",
                                        borderRadius: "7px",
                                        fontSize: "12px",
                                        background: "#fff",
                                    }}
                                >

                                    <option value="">
                                        Select Center
                                    </option>

                                    {centers.map((center) => (
                                        <option
                                            key={center.id}
                                            value={center.id}
                                        >
                                            {center.name}
                                        </option>
                                    ))}

                                </select>

                            </div>

                            {/* SUB CENTER NAME */}
                            <div
                                style={{
                                    marginBottom: "15px",
                                }}
                            >

                                <label
                                    style={{
                                        display: "block",
                                        marginBottom: "7px",
                                        color: "#4a5362",
                                        fontSize: "12px",
                                        fontWeight: 600,
                                    }}
                                >
                                    Sub-Center Name
                                </label>

                                <input
                                    type="text"
                                    value={subCenterName}
                                    onChange={(e) =>
                                        setSubCenterName(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter sub-center name"
                                    style={{
                                        width: "100%",
                                        padding: "10px 12px",
                                        border: "1px solid #dfe4eb",
                                        borderRadius: "7px",
                                        fontSize: "12px",
                                    }}
                                />

                            </div>

                            <button
                                type="submit"
                                className="outline-btn"
                                disabled={saving}
                            >
                                {saving
                                    ? "Saving..."
                                    : "Save Sub-Center"}
                            </button>

                        </form>

                    </div>
                )}

                {/* TABLE */}
                <div className="dashboard-panel">

                    <div className="panel-header">

                        <div>
                            <h5>Registered Sub-Centers</h5>

                            <p>
                                Sub-centers currently available
                                in the database
                            </p>
                        </div>

                        <span
                            style={{
                                color: "#8a93a3",
                                fontSize: "11px",
                            }}
                        >
                            {subCenters.length}{" "}
                            {subCenters.length === 1
                                ? "sub-center"
                                : "sub-centers"}
                        </span>

                    </div>

                    <div className="table-responsive">

                        <table className="dashboard-table">

                            <thead>

                                <tr>
                                    <th>ID</th>
                                    <th>Center Name</th>
                                    <th>Sub-Center Name</th>
                                </tr>

                            </thead>

                            <tbody>

                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan="3"
                                            style={{
                                                textAlign: "center",
                                                padding: "25px",
                                                color: "#8a93a3",
                                            }}
                                        >
                                            Loading sub-centers...
                                        </td>
                                    </tr>
                                ) : subCenters.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="3"
                                            style={{
                                                textAlign: "center",
                                                padding: "25px",
                                                color: "#8a93a3",
                                            }}
                                        >
                                            No Sub-Centers Found
                                        </td>
                                    </tr>
                                ) : (
                                    subCenters.map(
                                        (subCenter) => (
                                            <tr
                                                key={
                                                    subCenter.id
                                                }
                                            >

                                                <td>
                                                    {
                                                        subCenter.id
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        subCenter.center_name
                                                    }
                                                </td>

                                                <td
                                                    style={{
                                                        fontWeight: 600,
                                                        color: "#172033",
                                                    }}
                                                >
                                                    {
                                                        subCenter.name
                                                    }
                                                </td>

                                            </tr>
                                        )
                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default SubCenter;