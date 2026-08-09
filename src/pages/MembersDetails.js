import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

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

                <div className="card p-4">

                    <div className="d-flex justify-content-between align-items-center">

                        <h4>Member Details</h4>

                        <button
                            className="btn btn-secondary"
                            onClick={() =>
                                navigate("/family-details", {
                                    state: {
                                        familyId: family?.id || family?.familyId
                                    }
                                })
                            }
                        >
                            Back
                        </button>

                    </div>

                    <hr />

                    <div className="row">

                        <div className="col-md-6 mb-3">
                            <strong>Full Name:</strong>
                            <p>{member.full_name || "-"}</p>
                        </div>

                        <div className="col-md-6 mb-3">
                            <strong>Gender:</strong>
                            <p>{member.gender || "-"}</p>
                        </div>

                        <div className="col-md-6 mb-3">
                            <strong>Date of Birth:</strong>
                            <p>{member.dob || "-"}</p>
                        </div>

                        <div className="col-md-6 mb-3">
                            <strong>Approximate Age:</strong>
                            <p>{member.approx_age ?? "-"}</p>
                        </div>

                        <div className="col-md-6 mb-3">
                            <strong>Mobile Number:</strong>
                            <p>{member.mobile_no || "-"}</p>
                        </div>

                        <div className="col-md-6 mb-3">
                            <strong>Relation:</strong>
                            <p>{member.relation || "-"}</p>
                        </div>

                        <div className="col-md-6 mb-3">
                            <strong>Education:</strong>
                            <p>{member.education || "-"}</p>
                        </div>

                        <div className="col-md-6 mb-3">
                            <strong>Occupation:</strong>
                            <p>{member.occupation || "-"}</p>
                        </div>

                        <div className="col-md-6 mb-3">
                            <strong>Marital Status:</strong>
                            <p>{member.marital_status || "-"}</p>
                        </div>

                        <div className="col-md-6 mb-3">
                            <strong>Alive:</strong>
                            <p>
                                {member.is_alive == 1 ? "Yes" : "No"}
                            </p>
                        </div>

                        <div className="col-md-6 mb-3">
                            <strong>Head of Family:</strong>
                            <p>
                                {member.is_head == 1 ? "Yes" : "No"}
                            </p>
                        </div>

                        {member.is_alive == 0 && (
                            <div className="col-md-6 mb-3">
                                <strong>Date of Death:</strong>
                                <p>{member.date_of_death || "-"}</p>
                            </div>
                        )}

                    </div>

                    <hr />

                    <h5>Disease Information</h5>

                    <div className="mt-3">

                        {
                            member.disease_ids &&
                                member.disease_ids.length > 0 ? (

                                <div className="d-flex flex-wrap gap-2">

                                    {
                                        member.disease_ids.map((diseaseId) => {

                                            const disease = diseases.find(
                                                (item) =>
                                                    Number(item.id) ===
                                                    Number(diseaseId)
                                            );

                                            return (

                                                <span
                                                    key={diseaseId}
                                                    className="badge bg-primary"
                                                >
                                                    {
                                                        disease
                                                            ? disease.name
                                                            : `Disease ID: ${diseaseId}`
                                                    }
                                                </span>

                                            );

                                        })
                                    }

                                </div>

                            ) : (

                                <p className="text-muted">
                                    No diseases mapped.
                                </p>

                            )
                        }

                    </div>

            </div>

        </div>

        </div >

    );
}

export default MemberDetails;