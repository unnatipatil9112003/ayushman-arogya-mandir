import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/memberDetails.css";

function MemberDetails() {

    const location = useLocation();
    const navigate = useNavigate();

    const memberFromState = location.state?.member;
    const family = location.state?.family;

    const [member, setMember] = useState(
        memberFromState || null
    );

    const [diseases, setDiseases] = useState([]);

    useEffect(() => {

        const loadLatestMember = async () => {

            try {

                const token = localStorage.getItem("token");

                const familyId =
                    family?.id ||
                    family?.familyId;

                if (!familyId) {

                    console.error(
                        "Family ID not found"
                    );

                    return;
                }

                console.log(
                    "Loading latest member details for family:",
                    familyId
                );

                const response = await axios.get(
                    `http://localhost/backend/api/v1/get_family_details.php?id=${familyId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                console.log(
                    "Latest Family Details API:",
                    response.data
                );

                if (response.data.status === "success") {

                    const latestMembers =
                        response.data.data.members || [];

                    const latestMember =
                        latestMembers.find(
                            (item) =>
                                Number(item.id) ===
                                Number(memberFromState?.id)
                        );

                    console.log(
                        "Latest Member:",
                        latestMember
                    );

                    if (latestMember) {

                        setMember(latestMember);

                    }

                    setDiseases(
                        response.data.data.diseases || []
                    );

                }

            } catch (error) {

                console.error(
                    "Member Details Error:",
                    error
                );

            }

        };

        loadLatestMember();

    }, [family, memberFromState]);

    useEffect(() => {

        const loadDiseases = async () => {

            try {

                const token = localStorage.getItem("token");

                const familyId = family?.id || family?.familyId;

                if (!familyId) {
                    console.error("Family ID not found");
                    return;
                }

                const response = await axios.get(
                    `http://localhost/backend/api/v1/get_family_details.php?id=${familyId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                console.log(
                    "Member Details API:",
                    response.data
                );

                if (response.data.status === "success") {

                    setDiseases(
                        response.data.data.diseases || []
                    );

                }

            } catch (error) {

                console.error(
                    "Member Details API Error:",
                    error
                );

            }

        };

        loadDiseases();

    }, [family]);

    if (!member) {
        return (
            <div className="dashboard-container">

                <Sidebar />

                <div className="main-content">

                    <div className="alert alert-danger">
                        Member details not found.
                    </div>

                    <button
                        className="btn btn-primary"
                        onClick={() => navigate("/families")}
                    >
                        Back to Families
                    </button>

                </div>

            </div>
        );
    }

    return (
        <div className="dashboard-container">

            <Sidebar />

            <div className="main-content">

                <div className="member-details-page">

                    {/* PAGE HEADER */}
                    <div className="member-details-header">

                        <h2>Member Details</h2>

                        <div className="member-details-header-actions">

                            <button
                                className="member-back-btn"
                                onClick={() =>
                                    navigate("/family-details", {
                                        state: {
                                            familyId:
                                                family?.id ||
                                                family?.familyId
                                        }
                                    })
                                }
                            >
                                ← Back
                            </button>

                            <button
                                className="member-edit-btn"
                                onClick={() =>
                                    navigate("/add-member", {
                                        state: {
                                            family,
                                            editMember: member
                                        }
                                    })
                                }
                            >
                                Edit
                            </button>

                        </div>

                    </div>


                    {/* BASIC INFORMATION */}
                    <div className="member-details-card">

                        <h5>Personal Information</h5>

                        <hr className="member-details-divider" />

                        <div className="member-info-grid">

                            <div className="member-info-item">
                                <span className="member-info-label">
                                    Full Name
                                </span>

                                <span className="member-info-value">
                                    {member.full_name || "-"}
                                </span>
                            </div>


                            <div className="member-info-item">
                                <span className="member-info-label">
                                    Gender
                                </span>

                                <span className="member-info-value">
                                    {member.gender || "-"}
                                </span>
                            </div>


                            <div className="member-info-item">
                                <span className="member-info-label">
                                    Date of Birth
                                </span>

                                <span className="member-info-value">
                                    {member.dob || "-"}
                                </span>
                            </div>


                            <div className="member-info-item">
                                <span className="member-info-label">
                                    Approximate Age
                                </span>

                                <span className="member-info-value">
                                    {member.approx_age ?? "-"}
                                </span>
                            </div>


                            <div className="member-info-item">
                                <span className="member-info-label">
                                    Mobile Number
                                </span>

                                <span className="member-info-value">
                                    {member.mobile_no || "-"}
                                </span>
                            </div>


                            <div className="member-info-item">
                                <span className="member-info-label">
                                    Relation
                                </span>

                                <span className="member-info-value">
                                    {member.relation || "-"}
                                </span>
                            </div>

                        </div>

                    </div>


                    {/* EDUCATION & WORK */}
                    <div className="member-details-card">

                        <h5>Education & Occupation</h5>

                        <hr className="member-details-divider" />

                        <div className="member-info-grid">

                            <div className="member-info-item">
                                <span className="member-info-label">
                                    Education
                                </span>

                                <span className="member-info-value">
                                    {member.education || "-"}
                                </span>
                            </div>


                            <div className="member-info-item">
                                <span className="member-info-label">
                                    Occupation
                                </span>

                                <span className="member-info-value">
                                    {member.occupation || "-"}
                                </span>
                            </div>


                            <div className="member-info-item">
                                <span className="member-info-label">
                                    Marital Status
                                </span>

                                <span className="member-info-value">
                                    {member.marital_status || "-"}
                                </span>
                            </div>

                        </div>

                    </div>


                    {/* HEALTH INFORMATION */}
                    <div className="member-details-card">

                        <h5>Health Information</h5>

                        <hr className="member-details-divider" />

                        <div className="member-info-grid">

                            <div className="member-info-item">

                                <span className="member-info-label">
                                    Head of Family
                                </span>

                                <span
                                    className={`member-status ${member.is_head == 1
                                            ? "member-status-yes"
                                            : "member-status-no"
                                        }`}
                                >
                                    {member.is_head == 1
                                        ? "Yes"
                                        : "No"}
                                </span>

                            </div>


                            <div className="member-info-item">

                                <span className="member-info-label">
                                    Alive
                                </span>

                                <span
                                    className={`member-status ${member.is_alive == 1
                                            ? "member-status-yes"
                                            : "member-status-no"
                                        }`}
                                >
                                    {member.is_alive == 1
                                        ? "Yes"
                                        : "No"}
                                </span>

                            </div>


                            {member.is_alive == 0 && (

                                <div className="member-info-item">

                                    <span className="member-info-label">
                                        Date of Death
                                    </span>

                                    <span className="member-info-value">
                                        {member.date_of_death || "-"}
                                    </span>

                                </div>

                            )}

                        </div>

                    </div>


                    {/* DISEASE INFORMATION */}
                    <div className="member-details-card">

                        <h5>Disease Information</h5>

                        <hr className="member-details-divider" />

                        {
                            member.disease_ids &&
                                member.disease_ids.length > 0 ? (

                                <div className="member-disease-list">

                                    {
                                        member.disease_ids.map(
                                            (diseaseId) => {

                                                const disease =
                                                    diseases.find(
                                                        (item) =>
                                                            Number(item.id) ===
                                                            Number(diseaseId)
                                                    );

                                                return (

                                                    <span
                                                        key={diseaseId}
                                                        className="member-disease"
                                                    >
                                                        {
                                                            disease
                                                                ? disease.name
                                                                : `Disease ID: ${diseaseId}`
                                                        }
                                                    </span>

                                                );

                                            }
                                        )
                                    }

                                </div>

                            ) : (

                                <p className="member-no-disease">
                                    No diseases mapped.
                                </p>

                            )
                        }

                    </div>

                </div>

            </div>

        </div>
    );
}

export default MemberDetails;