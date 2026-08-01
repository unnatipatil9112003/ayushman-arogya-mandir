import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function Families() {

    const [families, setFamilies] = useState([]);

    useEffect(() => {

        const storedFamilies =
            JSON.parse(localStorage.getItem("families")) || [];

        setFamilies(storedFamilies);

    }, []);
    console.log(families);

    const navigate = useNavigate();

    const handleDelete = (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this family?"
        );

        if (!confirmDelete) {
            return;
        }

        // Read families
        const families =
            JSON.parse(localStorage.getItem("families")) || [];

        // Remove selected family
        const updatedFamilies = families.filter(
            (family) => family.id !== id
        );

        // Save updated array
        localStorage.setItem(
            "families",
            JSON.stringify(updatedFamilies)
        );

        // Delete members
        const members =
            JSON.parse(localStorage.getItem("members")) || [];

        const updatedMembers = members.filter(
            (member) => member.familyId !== id
        );

        localStorage.setItem(
            "members",
            JSON.stringify(updatedMembers)
        );

        window.location.reload();
        console.log("Family Deleted Successfully");

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

                                    <td>{family.houseNumber}</td>

                                    <td>{family.village}</td>

                                    <td>--</td>

                                    <td>0</td>

                                    <td>

                                        <button
                                            className="btn btn-sm btn-primary"
                                            onClick={() =>
                                                navigate("/family-details", {
                                                    state: family
                                                })
                                            }
                                        >
                                            View
                                        </button>

                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDelete(family.id)}
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