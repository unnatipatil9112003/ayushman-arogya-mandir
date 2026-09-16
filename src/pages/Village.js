import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { getApiUrl } from "../config/api";


function Village() {
    const [centers, setCenters] = useState([]);
    const [subCenters, setSubCenters] = useState([]);
    const [villages, setVillages] = useState([]);

    const [selectedCenter, setSelectedCenter] = useState("");
    const [selectedSubCenter, setSelectedSubCenter] =
        useState("");

    const [villageName, setVillageName] = useState("");
    const [population, setPopulation] = useState("");
    const [families, setFamilies] = useState("");

    const [loading, setLoading] = useState(true);
    const [loadingSubCenters, setLoadingSubCenters] =
        useState(false);

    const [showForm, setShowForm] = useState(false);

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

    /* =========================
       LOAD CENTERS
    ========================= */

    const fetchCenters = async () => {
        const response = await fetch(
            getApiUrl("get_centers.php"),
            {
                method: "GET",
                headers: getHeaders(),
            }
        );

        const result = await response.json();

        if (!response.ok || result.status !== "success") {
            throw new Error(
                result.message ||
                "Unable to load centers."
            );
        }

        return result.data || [];
    };

    /* =========================
       LOAD SUB CENTERS
    ========================= */

    const fetchSubCentersForCenter = async (
        centerId
    ) => {
        const response = await fetch(
            `${getApiUrl("get_sub_centers.php")}?center_id=${centerId}`,
            {
                method: "GET",
                headers: getHeaders(),
            }
        );

        const result = await response.json();

        if (!response.ok || result.status !== "success") {
            throw new Error(
                result.message ||
                "Unable to load sub-centers."
            );
        }

        return result.data || [];
    };

    /* =========================
       LOAD VILLAGES
    ========================= */

    const fetchVillagesForSubCenter = async (
        subCenter
    ) => {
        const response = await fetch(
            `${getApiUrl("get_villages.php")}?sub_center_id=${subCenter.id}`,
            {
                method: "GET",
                headers: getHeaders(),
            }
        );

        const result = await response.json();

        if (!response.ok || result.status !== "success") {
            throw new Error(
                result.message ||
                "Unable to load villages."
            );
        }

        return (result.data || []).map((village) => ({
            ...village,
            sub_center_id: subCenter.id,
            sub_center_name: subCenter.name,
            center_id: subCenter.center_id,
            center_name: subCenter.center_name,
        }));
    };

    /* =========================
       LOAD ALL MASTER DATA
    ========================= */

    const fetchAllVillageData = async () => {
        try {
            setLoading(true);
            setError("");

            const centerData = await fetchCenters();

            setCenters(centerData);

            if (centerData.length === 0) {
                setSubCenters([]);
                setVillages([]);
                return;
            }

            /*
             * Get every sub-center.
             */

            const subCenterResults = await Promise.all(
                centerData.map(async (center) => {
                    const data =
                        await fetchSubCentersForCenter(
                            center.id
                        );

                    return data.map((subCenter) => ({
                        ...subCenter,
                        center_id: center.id,
                        center_name: center.name,
                    }));
                })
            );

            const allSubCenters =
                subCenterResults.flat();

            setSubCenters(allSubCenters);

            if (allSubCenters.length === 0) {
                setVillages([]);
                return;
            }

            /*
             * Get villages for every sub-center.
             */

            const villageResults = await Promise.all(
                allSubCenters.map(
                    fetchVillagesForSubCenter
                )
            );

            const allVillages =
                villageResults.flat();

            setVillages(allVillages);

        } catch (err) {
            console.error(
                "Village loading error:",
                err
            );

            setError(
                err.message ||
                "Unable to load villages."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllVillageData();
    }, []);

    /* =========================
       CENTER CHANGE
    ========================= */

    const handleCenterChange = async (e) => {
        const centerId = e.target.value;

        setSelectedCenter(centerId);
        setSelectedSubCenter("");

        if (!centerId) {
            setSubCenters([]);
            return;
        }

        try {
            setLoadingSubCenters(true);

            const data =
                await fetchSubCentersForCenter(
                    centerId
                );

            setSubCenters(
                data.map((subCenter) => ({
                    ...subCenter,
                    center_id: Number(centerId),
                }))
            );

        } catch (err) {
            setError(
                err.message ||
                "Unable to load sub-centers."
            );
        } finally {
            setLoadingSubCenters(false);
        }
    };

    /* =========================
       ADD VILLAGE
    ========================= */

    const handleAddVillage = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        const name = villageName.trim();

        if (!selectedCenter) {
            setError("Please select a center.");
            return;
        }

        if (!selectedSubCenter) {
            setError("Please select a sub-center.");
            return;
        }

        if (!name) {
            setError("Please enter village name.");
            return;
        }

        if (
            population !== "" &&
            Number(population) < 0
        ) {
            setError(
                "Population cannot be negative."
            );
            return;
        }

        if (
            families !== "" &&
            Number(families) < 0
        ) {
            setError(
                "Approximate families cannot be negative."
            );
            return;
        }

        try {
            setSaving(true);

            const response = await fetch(
                getApiUrl("save_master_data.php"),
                {
                    method: "POST",
                    headers: getHeaders(),
                    body: JSON.stringify({
                        type: "village",
                        sub_center_id:
                            Number(selectedSubCenter),
                        name: name,
                        approx_population:
                            population === ""
                                ? 0
                                : Number(population),
                        approx_families:
                            families === ""
                                ? 0
                                : Number(families),
                    }),
                }
            );

            const result = await response.json();

            if (!response.ok || result.status !== "success") {
                throw new Error(
                    result.message ||
                    "Unable to add village."
                );
            }

            setVillageName("");
            setPopulation("");
            setFamilies("");

            setSelectedCenter("");
            setSelectedSubCenter("");

            setShowForm(false);

            setSuccess(
                "Village added successfully."
            );

            await fetchAllVillageData();

        } catch (err) {
            console.error(
                "Add village error:",
                err
            );

            setError(
                err.message ||
                "Unable to add village."
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

                        <h2>Villages</h2>

                        <p>
                            Manage villages and their population
                            information
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
                            : "+ Add Village"}
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

                {/* ADD VILLAGE FORM */}
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
                                Add New Village
                            </h5>

                            <p
                                style={{
                                    margin: "5px 0 0",
                                    color: "#8a93a3",
                                    fontSize: "11px",
                                }}
                            >
                                Select the center and sub-center,
                                then enter village details.
                            </p>

                        </div>

                        <form onSubmit={handleAddVillage}>

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
                                    onChange={
                                        handleCenterChange
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

                                    {centers.map(
                                        (center) => (
                                            <option
                                                key={
                                                    center.id
                                                }
                                                value={
                                                    center.id
                                                }
                                            >
                                                {
                                                    center.name
                                                }
                                            </option>
                                        )
                                    )}

                                </select>

                            </div>

                            {/* SUB CENTER */}
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
                                    Sub-Center
                                </label>

                                <select
                                    value={
                                        selectedSubCenter
                                    }
                                    onChange={(e) =>
                                        setSelectedSubCenter(
                                            e.target.value
                                        )
                                    }
                                    disabled={
                                        !selectedCenter ||
                                        loadingSubCenters
                                    }
                                    style={{
                                        width: "100%",
                                        padding: "10px 12px",
                                        border: "1px solid #dfe4eb",
                                        borderRadius: "7px",
                                        fontSize: "12px",
                                        background:
                                            !selectedCenter
                                                ? "#f5f7fb"
                                                : "#fff",
                                    }}
                                >

                                    <option value="">
                                        {loadingSubCenters
                                            ? "Loading..."
                                            : "Select Sub-Center"}
                                    </option>

                                    {subCenters.map(
                                        (subCenter) => (
                                            <option
                                                key={
                                                    subCenter.id
                                                }
                                                value={
                                                    subCenter.id
                                                }
                                            >
                                                {
                                                    subCenter.name
                                                }
                                            </option>
                                        )
                                    )}

                                </select>

                            </div>

                            {/* VILLAGE NAME */}
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
                                    Village Name
                                </label>

                                <input
                                    type="text"
                                    value={villageName}
                                    onChange={(e) =>
                                        setVillageName(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter village name"
                                    style={{
                                        width: "100%",
                                        padding: "10px 12px",
                                        border: "1px solid #dfe4eb",
                                        borderRadius: "7px",
                                        fontSize: "12px",
                                    }}
                                />

                            </div>

                            {/* POPULATION */}
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
                                    Approx. Population
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    value={population}
                                    onChange={(e) =>
                                        setPopulation(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter approximate population"
                                    style={{
                                        width: "100%",
                                        padding: "10px 12px",
                                        border: "1px solid #dfe4eb",
                                        borderRadius: "7px",
                                        fontSize: "12px",
                                    }}
                                />

                            </div>

                            {/* FAMILIES */}
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
                                    Approx. Families
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    value={families}
                                    onChange={(e) =>
                                        setFamilies(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter approximate families"
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
                                    : "Save Village"}
                            </button>

                        </form>

                    </div>
                )}

                {/* VILLAGE TABLE */}
                <div className="dashboard-panel">

                    <div className="panel-header">

                        <div>

                            <h5>Registered Villages</h5>

                            <p>
                                Villages currently available
                                in the database
                            </p>

                        </div>

                        <span
                            style={{
                                color: "#8a93a3",
                                fontSize: "11px",
                            }}
                        >
                            {villages.length}{" "}
                            {villages.length === 1
                                ? "village"
                                : "villages"}
                        </span>

                    </div>

                    <div className="table-responsive">

                        <table className="dashboard-table">

                            <thead>

                                <tr>

                                    <th>ID</th>

                                    <th>Center</th>

                                    <th>Sub-Center</th>

                                    <th>Village</th>

                                    <th>Population</th>

                                    <th>Families</th>

                                </tr>

                            </thead>

                            <tbody>

                                {loading ? (
                                    <tr>

                                        <td
                                            colSpan="6"
                                            style={{
                                                textAlign:
                                                    "center",
                                                padding:
                                                    "25px",
                                                color:
                                                    "#8a93a3",
                                            }}
                                        >
                                            Loading villages...
                                        </td>

                                    </tr>
                                ) : villages.length === 0 ? (
                                    <tr>

                                        <td
                                            colSpan="6"
                                            style={{
                                                textAlign:
                                                    "center",
                                                padding:
                                                    "25px",
                                                color:
                                                    "#8a93a3",
                                            }}
                                        >
                                            No Villages Found
                                        </td>

                                    </tr>
                                ) : (
                                    villages.map(
                                        (village) => (
                                            <tr
                                                key={
                                                    village.id
                                                }
                                            >

                                                <td>
                                                    {
                                                        village.id
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        village.center_name ||
                                                        "-"
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        village.sub_center_name ||
                                                        "-"
                                                    }
                                                </td>

                                                <td
                                                    style={{
                                                        fontWeight:
                                                            600,
                                                        color:
                                                            "#172033",
                                                    }}
                                                >
                                                    {
                                                        village.name
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        village.approx_population ??
                                                        "-"
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        village.approx_families ??
                                                        "-"
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

export default Village;