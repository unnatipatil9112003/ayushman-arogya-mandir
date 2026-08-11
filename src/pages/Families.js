import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";

function Families() {

    const [families, setFamilies] = useState([]);

    useEffect(() => {

        const loadFamilies = async () => {

            try {

                const token = localStorage.getItem("token");

                const response = await axios.get(
                    "http://localhost/backend/api/v1/get_families.php",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                console.log("Families List:", response.data.data);

                if (response.data.status === "success") {

                    setFamilies(response.data.data);

                }

            } catch (error) {

                console.error("Families API Error:", error);

            }

        };

        loadFamilies();

    }, []);
    console.log(families);

    const navigate = useNavigate();

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this family?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            const token = localStorage.getItem("token");

            console.log("Deleting Family ID:", id);

            const response = await axios.post(
                "http://localhost/backend/api/v1/delete_family.php",
                {
                    id: id
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            console.log("Delete Family Response:", response.data);

            if (response.data.status === "success") {

                alert("Family deleted successfully.");

                // Reload family list
                window.location.reload();

            } else {

                alert(
                    response.data.message ||
                    "Failed to delete family."
                );

            }

        } catch (error) {

            console.error(
                "Delete Family Error:",
                error
            );

            if (error.response) {

                console.error(
                    "Server Response:",
                    error.response.data
                );

                alert(
                    error.response.data.message ||
                    "Failed to delete family."
                );

            } else {

                alert(
                    "Unable to connect to the server."
                );

            }

        }

    };

    return (

        <div className="dashboard-container">

            <Sidebar />

            <div className="main-content">

                <div className="dashboard-header">

                    <h2>Families</h2>

                    <div className="d-flex gap-4">

                        <button
                            className="btn btn-outline-secondary"
                        >
                            Search
                        </button>

                        <button
                            className="btn add-btn"
                            onClick={() => navigate("/add-family")}
                        >
                            + Add Family
                        </button>

                    </div>

                </div>

                {/* Families Table */}

                <table className="table table-bordered table-hover text-center">

                    <thead>

                        <tr>

                            <th>Family No</th>
                            <th>Village</th>
                            <th>Head of Family</th>
                            <th>Total Members</th>
                            <th>Action</th>

                        </tr>

                    </thead>

                    <tbody>

                        {families.length === 0 ? (

                            <tr>
                                <td colSpan="5">
                                    No Families Found
                                </td>
                            </tr>

                        ) : (

                            families.map((family, index) => (

                                <tr key={index}>

                                    <td>{family.house_no}</td>

                                    <td>{family.village_name}</td>

                                    <td>{family.head_name || "--"}</td>

                                    <td>{family.total_members}</td>

                                    <td>

                                        <button
                                            className="btn btn-sm btn-primary"
                                            onClick={() =>
                                                navigate("/family-details", {
                                                    state: {
                                                        familyId: family.family_id
                                                    }
                                                })
                                            }
                                        >
                                            View
                                        </button>

                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDelete(family.family_id)}
                                        >
                                            Delete
                                        </button>

                                    </td>

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

            </div>

        </div>

    );

}

export default Families;