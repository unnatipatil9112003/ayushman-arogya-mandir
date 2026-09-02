import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/familyDetails.css";

function FamilyDetails() {

    const location = useLocation();
    const familyData = location.state;

    console.log("Family Data:", familyData);

    const [familyMembers, setFamilyMembers] = useState([]);
    const [family, setFamily] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {

        const loadFamilyDetails = async () => {

            try {

                const token = localStorage.getItem("token");

                const familyId =
                    familyData?.id ||
                    familyData?.familyId;

                const response = await axios.get(
                    `http://localhost/backend/api/v1/get_family_details.php?id=${familyId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                console.log(
                    JSON.stringify(response.data, null, 2)
                );

                if (response.data.status === "success") {

                    setFamily(
                        response.data.data.family
                    );

                    setFamilyMembers(
                        response.data.data.members
                    );

                }

            } catch (error) {

                console.error(
                    "Family Details Error:",
                    error
                );

            }

        };

        loadFamilyDetails();

    }, []);

    /*
     * Loading state
     */

    if (!family) {

        return (

            <div className="dashboard-container">

                <Sidebar />

                <div className="main-content">

                    <div className="family-details-loading">

                        <div className="spinner-border text-primary">
                        </div>

                        <p>
                            Loading Family Details...
                        </p>

                    </div>

                </div>

            </div>

        );

    }

    /*
     * Edit Member
     */

    const handleEditMember = (member) => {

        navigate("/add-member", {

            state: {

                family,
                editMember: member

            }

        });

    };

    /*
     * Delete Member
     */

    const handleDeleteMember = async (member) => {

        const confirmDelete = window.confirm(
            `Are you sure you want to delete ${member.full_name}?`
        );

        if (!confirmDelete) {
            return;
        }

        try {

            const token =
                localStorage.getItem("token");

            const response = await axios.post(

                "http://localhost/backend/api/v1/delete_member.php",

                {
                    id: member.id
                },

                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }

            );

            console.log(
                "Delete Response:",
                response.data
            );

            if (
                response.data.status === "success"
            ) {

                setFamilyMembers(

                    familyMembers.filter(
                        (item) =>
                            item.id !== member.id
                    )

                );

            }

        } catch (error) {

            console.error(
                "Delete Error:",
                error
            );

        }

    };

    /*
     * Family fields
     */

    const villageName =
        family.village_name ||
        family.village ||
        family.village_id ||
        "-";

    const centerName =
        family.center_name ||
        family.center ||
        family.center_id ||
        "-";

    const subCenterName =
        family.sub_center_name ||
        family.subCenter ||
        family.sub_center_id ||
        "-";

    /*
     * Page
     */

    return (

        <div className="dashboard-container">

            <Sidebar />

            <div className="main-content">

                {/* ================================
                    PAGE HEADER
                ================================= */}

                <div className="family-page-header">

                    <div>

                        <div className="family-breadcrumb">

                            <span
                                onClick={() =>
                                    navigate("/families")
                                }
                            >
                                Families
                            </span>

                            <span className="breadcrumb-arrow">
                                ›
                            </span>

                            <span>
                                Family Details
                            </span>

                        </div>

                        <h2>
                            Family Details
                        </h2>

                        <p>
                            View household and family member information
                        </p>

                    </div>

                    <div className="family-header-actions">

                        <button
                            className="btn family-edit-btn"
                            onClick={() =>
                                navigate(
                                    "/add-family",
                                    {
                                        state: family
                                    }
                                )
                            }
                        >
                            <span>✎</span>
                            Edit Family
                        </button>

                        <button
                            className="btn family-add-member-btn"
                            onClick={() =>
                                navigate(
                                    "/add-member",
                                    {
                                        state: familyData
                                    }
                                )
                            }
                        >
                            <span>+</span>
                            Add Member
                        </button>

                    </div>

                </div>


                {/* ================================
                    FAMILY INFORMATION
                ================================= */}

                <div className="family-info-card">

                    <div className="family-card-title">

                        <div>

                            <h4>
                                Household Information
                            </h4>

                            <p>
                                Basic information about this family
                            </p>

                        </div>

                    </div>


                    <div className="family-info-grid">

                        {/* Column 1 */}

                        <div className="family-info-column">

                            <div className="info-item">

                                <span>
                                    House No.
                                </span>

                                <strong>
                                    {family.house_no || "-"}
                                </strong>

                            </div>

                            <div className="info-item">

                                <span>
                                    Family No.
                                </span>

                                <strong>
                                    {family.family_no || "-"}
                                </strong>

                            </div>

                            <div className="info-item">

                                <span>
                                    Head of Family
                                </span>

                                <strong>
                                    {
                                        family.head_name ||
                                        family.head_of_family ||
                                        "-"
                                    }
                                </strong>

                            </div>

                        </div>


                        {/* Column 2 */}

                        <div className="family-info-column">

                            <div className="info-item">

                                <span>
                                    Village
                                </span>

                                <strong>
                                    {villageName}
                                </strong>

                            </div>

                            <div className="info-item">

                                <span>
                                    Sub Center
                                </span>

                                <strong>
                                    {subCenterName}
                                </strong>

                            </div>

                            <div className="info-item">

                                <span>
                                    Center
                                </span>

                                <strong>
                                    {centerName}
                                </strong>

                            </div>

                        </div>


                        {/* Column 3 */}

                        <div className="family-info-column">

                            <div className="info-item">

                                <span>
                                    Ration Card
                                </span>

                                <strong>
                                    {
                                        family.ration_card ||
                                        "-"
                                    }
                                </strong>

                            </div>

                            <div className="info-item">

                                <span>
                                    Card Type
                                </span>

                                <strong>
                                    {
                                        family.card_type ||
                                        "-"
                                    }
                                </strong>

                            </div>

                            <div className="info-item">

                                <span>
                                    Social Category
                                </span>

                                <strong>
                                    {
                                        family.social_category ||
                                        "-"
                                    }
                                </strong>

                            </div>

                            <div className="info-item">

                                <span>
                                    Sanitation Facility
                                </span>

                                <strong>
                                    {
                                        family.sanitation_facility ||
                                        "-"
                                    }
                                </strong>

                            </div>

                        </div>

                    </div>


                    {/* Address */}

                    <div className="family-address">

                        <span>
                            Address
                        </span>

                        <strong>
                            {
                                family.address ||
                                "-"
                            }
                        </strong>

                    </div>

                </div>


                {/* ================================
                    MEMBERS CARD
                ================================= */}

                <div className="members-card">

                    <div className="members-card-header">

                        <div>

                            <h4>
                                Family Members
                                <span className="member-count">
                                    {familyMembers.length}
                                </span>
                            </h4>

                            <p>
                                Members registered under this household
                            </p>

                        </div>

                        <button
                            className="btn family-add-member-btn"
                            onClick={() =>
                                navigate(
                                    "/add-member",
                                    {
                                        state: familyData
                                    }
                                )
                            }
                        >
                            <span>+</span>
                            Add Member
                        </button>

                    </div>


                    <div className="members-content">

                        {
                            familyMembers.length === 0 ? (

                                <div className="no-members">

                                    <div className="no-members-icon">
                                        👥
                                    </div>

                                    <h5>
                                        No Members Added Yet
                                    </h5>

                                    <p>
                                        Add a family member to see
                                        their details here.
                                    </p>

                                    <button
                                        className="btn family-add-member-btn"
                                        onClick={() =>
                                            navigate(
                                                "/add-member",
                                                {
                                                    state: familyData
                                                }
                                            )
                                        }
                                    >
                                        + Add Member
                                    </button>

                                </div>

                            ) : (

                                <>

                                    {/* Desktop Table */}

                                    <div className="members-table-wrapper">

                                        <table className="members-table">

                                            <thead>

                                                <tr>

                                                    <th>
                                                        Name
                                                    </th>

                                                    <th>
                                                        Relation
                                                    </th>

                                                    <th>
                                                        Age
                                                    </th>

                                                    <th>
                                                        Gender
                                                    </th>

                                                    <th>
                                                        Mobile
                                                    </th>

                                                    <th>
                                                        Status
                                                    </th>

                                                    <th>
                                                        Actions
                                                    </th>

                                                </tr>

                                            </thead>

                                            <tbody>

                                                {
                                                    familyMembers.map(
                                                        (member) => (

                                                            <tr
                                                                key={
                                                                    member.id
                                                                }
                                                            >

                                                                <td>

                                                                    <div className="member-name">

                                                                        <div className="member-avatar">

                                                                            {
                                                                                member.full_name
                                                                                    ?.charAt(
                                                                                        0
                                                                                    )
                                                                                    ?.toUpperCase()
                                                                            }

                                                                        </div>

                                                                        <strong>
                                                                            {
                                                                                member.full_name
                                                                            }
                                                                        </strong>

                                                                    </div>

                                                                </td>

                                                                <td>
                                                                    {
                                                                        member.relation ||
                                                                        "-"
                                                                    }
                                                                </td>

                                                                <td>
                                                                    {
                                                                        member.approx_age ??
                                                                        "-"
                                                                    }
                                                                </td>

                                                                <td>
                                                                    {
                                                                        member.gender ||
                                                                        "-"
                                                                    }
                                                                </td>

                                                                <td>
                                                                    {
                                                                        member.mobile_no ||
                                                                        "-"
                                                                    }
                                                                </td>

                                                                <td>

                                                                    <span
                                                                        className={
                                                                            member.is_alive == 1
                                                                                ? "member-status active"
                                                                                : "member-status inactive"
                                                                        }
                                                                    >

                                                                        {
                                                                            member.is_alive == 1
                                                                                ? "Alive"
                                                                                : "Inactive"
                                                                        }

                                                                    </span>

                                                                </td>

                                                                <td>

                                                                    <div className="member-actions">

                                                                        <button
                                                                            className="action-btn view"
                                                                            title="View"
                                                                            onClick={() =>
                                                                                navigate(
                                                                                    "/member-details",
                                                                                    {
                                                                                        state: {
                                                                                            family,
                                                                                            member
                                                                                        }
                                                                                    }
                                                                                )
                                                                            }
                                                                        >
                                                                            👁
                                                                        </button>

                                                                        <button
                                                                            className="action-btn edit"
                                                                            title="Edit"
                                                                            onClick={() =>
                                                                                handleEditMember(
                                                                                    member
                                                                                )
                                                                            }
                                                                        >
                                                                            ✎
                                                                        </button>

                                                                        <button
                                                                            className="action-btn delete"
                                                                            title="Delete"
                                                                            onClick={() =>
                                                                                handleDeleteMember(
                                                                                    member
                                                                                )
                                                                            }
                                                                        >
                                                                            🗑
                                                                        </button>

                                                                    </div>

                                                                </td>

                                                            </tr>

                                                        )
                                                    )
                                                }

                                            </tbody>

                                        </table>

                                    </div>


                                    {/* Mobile Cards */}

                                    <div className="mobile-members-list">

                                        {
                                            familyMembers.map(
                                                (member) => (

                                                    <div
                                                        className="mobile-member-card"
                                                        key={
                                                            member.id
                                                        }
                                                    >

                                                        <div className="mobile-member-header">

                                                            <div className="member-name">

                                                                <div className="member-avatar">

                                                                    {
                                                                        member.full_name
                                                                            ?.charAt(
                                                                                0
                                                                            )
                                                                            ?.toUpperCase()
                                                                    }

                                                                </div>

                                                                <div>

                                                                    <strong>
                                                                        {
                                                                            member.full_name
                                                                        }
                                                                    </strong>

                                                                    <small>
                                                                        {
                                                                            member.relation ||
                                                                            "-"
                                                                        }
                                                                    </small>

                                                                </div>

                                                            </div>

                                                            <span
                                                                className={
                                                                    member.is_alive == 1
                                                                        ? "member-status active"
                                                                        : "member-status inactive"
                                                                }
                                                            >
                                                                {
                                                                    member.is_alive == 1
                                                                        ? "Alive"
                                                                        : "Inactive"
                                                                }
                                                            </span>

                                                        </div>


                                                        <div className="mobile-member-details">

                                                            <div>
                                                                <span>
                                                                    Age
                                                                </span>

                                                                <strong>
                                                                    {
                                                                        member.approx_age ??
                                                                        "-"
                                                                    }
                                                                </strong>
                                                            </div>

                                                            <div>
                                                                <span>
                                                                    Gender
                                                                </span>

                                                                <strong>
                                                                    {
                                                                        member.gender ||
                                                                        "-"
                                                                    }
                                                                </strong>
                                                            </div>

                                                            <div>
                                                                <span>
                                                                    Mobile
                                                                </span>

                                                                <strong>
                                                                    {
                                                                        member.mobile_no ||
                                                                        "-"
                                                                    }
                                                                </strong>
                                                            </div>

                                                        </div>


                                                        <div className="mobile-member-actions">

                                                            <button
                                                                className="btn btn-primary"
                                                                onClick={() =>
                                                                    navigate(
                                                                        "/member-details",
                                                                        {
                                                                            state: {
                                                                                family,
                                                                                member
                                                                            }
                                                                        }
                                                                    )
                                                                }
                                                            >
                                                                View
                                                            </button>

                                                            <button
                                                                className="btn btn-warning"
                                                                onClick={() =>
                                                                    handleEditMember(
                                                                        member
                                                                    )
                                                                }
                                                            >
                                                                Edit
                                                            </button>

                                                            <button
                                                                className="btn btn-danger"
                                                                onClick={() =>
                                                                    handleDeleteMember(
                                                                        member
                                                                    )
                                                                }
                                                            >
                                                                Delete
                                                            </button>

                                                        </div>

                                                    </div>

                                                )
                                            )
                                        }

                                    </div>

                                </>

                            )
                        }

                    </div>

                </div>


                {/* ================================
                    BACK BUTTON
                ================================= */}

                <button
                    className="back-families-btn"
                    onClick={() =>
                        navigate("/families")
                    }
                >
                    ← Back to Families
                </button>

            </div>

        </div>

    );

}

export default FamilyDetails;