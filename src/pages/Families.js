import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/families.css";

function Families() {
    const navigate = useNavigate();

    const [families, setFamilies] = useState([]);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

    const itemsPerPage = 10;

    // Loading
    const [loading, setLoading] = useState(false);

    // Load families
    const loadFamilies = async () => {
        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            const response = await axios.get(
                `http://localhost/backend/api/v1/get_families.php?page=${currentPage}&limit=${itemsPerPage}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("Families List:", response.data.data);
            console.log("Pagination:", response.data.pagination);

            if (response.data.status === "success") {
                setFamilies(response.data.data || []);

                setTotalPages(
                    response.data.pagination?.total_pages || 1
                );

                setTotalRecords(
                    response.data.pagination?.total_records || 0
                );
            }
        } catch (error) {
            console.error("Families API Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFamilies();
    }, [currentPage]);

    // Delete family
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
                    id: id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log(
                "Delete Family Response:",
                response.data
            );

            if (response.data.status === "success") {
                alert("Family deleted successfully.");

                // Reload current page
                loadFamilies();
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

    // Go to previous page
    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Go to next page
    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Go to specific page
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Generate page numbers
    const getPageNumbers = () => {
        const pages = [];

        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }

        return pages;
    };

    return (
        <div className="dashboard-container">

            <Sidebar />

            <div className="main-content">

                <div className="families-page">

                    {/* Header */}
                    <div className="families-header">

                        <div className="families-title">
                            <h2>Families</h2>
                            <p>Manage registered families and household information</p>
                        </div>

                        <div className="families-actions">

                            <input
                                type="text"
                                className="families-search"
                                placeholder="Search families..."
                            />

                            <button
                                className="families-add-btn"
                                onClick={() => navigate("/add-family")}
                            >
                                + Add Family
                            </button>

                        </div>

                    </div>

                    {/* Table */}
                    <div className="families-table-card">

                        <div className="families-table-wrapper">

                            <table className="families-table">

                                <thead>
                                    <tr>
                                        <th>Family No</th>
                                        <th>Village</th>
                                        <th>Head of Family</th>
                                        <th>Total Members</th>
                                        <th className="text-center">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {families.length === 0 ? (

                                        <tr>
                                            <td
                                                colSpan="5"
                                                className="families-empty"
                                            >
                                                No Families Found
                                            </td>
                                        </tr>

                                    ) : (

                                        families.map((family) => (

                                            <tr key={family.family_id}>

                                                <td>
                                                    <span className="family-number">
                                                        {family.house_no}
                                                    </span>
                                                </td>

                                                <td>
                                                    <span className="family-village">
                                                        {family.village_name}
                                                    </span>
                                                </td>

                                                <td>
                                                    {family.head_name || "--"}
                                                </td>

                                                <td>
                                                    <span className="member-count">
                                                        {family.total_members}
                                                    </span>
                                                </td>

                                                <td>

                                                    <div className="family-actions">

                                                        <button
                                                            className="family-view-btn"
                                                            onClick={() =>
                                                                navigate(
                                                                    "/family-details",
                                                                    {
                                                                        state: {
                                                                            familyId:
                                                                                family.family_id
                                                                        }
                                                                    }
                                                                )
                                                            }
                                                        >
                                                            View
                                                        </button>

                                                        <button
                                                            className="family-delete-btn"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    family.family_id
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        ))

                                    )}

                                </tbody>

                            </table>

                        </div>

                        {/* Pagination */}

                        <div className="families-pagination">

                            <div className="pagination-info">
                                Showing {families.length} families
                            </div>

                            <div className="pagination-buttons">

                                <button
                                    className="pagination-btn"
                                    disabled={currentPage === 1}
                                    onClick={() =>
                                        loadFamilies(currentPage - 1)
                                    }
                                >
                                    Previous
                                </button>

                                {Array.from(
                                    { length: totalPages },
                                    (_, index) => index + 1
                                ).map((page) => (

                                    <button
                                        key={page}
                                        className={`pagination-btn ${currentPage === page
                                                ? "active"
                                                : ""
                                            }`}
                                        onClick={() =>
                                            loadFamilies(page)
                                        }
                                    >
                                        {page}
                                    </button>

                                ))}

                                <button
                                    className="pagination-btn"
                                    disabled={currentPage === totalPages}
                                    onClick={() =>
                                        loadFamilies(currentPage + 1)
                                    }
                                >
                                    Next
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default Families;