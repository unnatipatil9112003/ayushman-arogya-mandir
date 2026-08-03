import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

function FamilyDetails() {

    const location = useLocation();
    const familyData = location.state;
    console.log("Family Data:", familyData);
    const [familyMembers, setFamilyMembers] = useState([]);
    const [family, setFamily] = useState(null);
    const navigate = useNavigate();

    // const members =
    //     JSON.parse(localStorage.getItem("members")) || [];

    // const familyMembers =
    //     members.filter(
    //         (member) =>
    //             member.familyId === familyData.id
    //     );
    console.log(familyMembers);

    useEffect(() => {

        const loadFamilyDetails = async () => {

            try {

                const token = localStorage.getItem("token");

                const response = await axios.get(
                    `http://localhost/backend/api/v1/get_family_details.php?id=${familyData.familyId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                console.log(JSON.stringify(response.data, null, 2));

                if (response.data.status === "success") {

                    setFamily(response.data.data.family);

                    setFamilyMembers(response.data.data.members);

                }

            } catch (error) {

                console.error("Family Details Error:", error);

            }

        };

        loadFamilyDetails();

    }, []);
    if (!family) {
        return (
            <div className="dashboard-container">
                <Sidebar />
                <div className="main-content">
                    <h3>Loading Family Details...</h3>
                </div>
            </div>
        );
    }

    const handleEditMember = (member) => {

        navigate("/add-member", {
            state: {
                family,
                editMember: member
            }
        });

    };

    const handleDeleteMember = (member) => {

        const confirmDelete = window.confirm(
            `Are you sure you want to delete ${member.fullName}?`
        );

        if (!confirmDelete) {
            return;
        }

        // Read members from Local Storage
        const members =
            JSON.parse(localStorage.getItem("members")) || [];

        // Remove selected member
        const updatedMembers = members.filter(
            (item) => item.id !== member.id
        );

        // Save updated list
        localStorage.setItem(
            "members",
            JSON.stringify(updatedMembers)
        );

        // Refresh Family Details page
        navigate("/family-details", {
            state: familyData
        });

    };

    return (

        <div className="dashboard-container">

            <Sidebar />

            <div className="main-content">

                <div className="card p-4 mb-4">

                    <div className="d-flex justify-content-between align-items-center">

                        <h4>Family Information</h4>

                        <button
                            className="btn btn-outline-primary"
                            onClick={() =>
                                navigate("/add-family", {
                                    state: familyData,
                                })
                            }
                        >
                            Edit
                        </button>

                    </div>

                    <hr />

                    <p><strong>House Number:</strong> {family.house_no}</p>
                    <p><strong>Village ID:</strong> {family.village_id}</p>
                    <p><strong>Address:</strong> {family.address}</p>
                    <p><strong>Ration Card:</strong> {family.ration_card}</p>
                    <p><strong>Card Type:</strong> {family.card_type}</p>
                    <p><strong>Category:</strong> {family.social_category}</p>
                    <p><strong>Toilet:</strong> {family.sanitation_facility}</p>
                </div>

                <div className="card p-4">

                    <div className="d-flex justify-content-between align-items-center">

                        <h4>Family Members</h4>

                        <button
                            className="btn add-btn"
                            onClick={() =>
                                navigate("/add-member", {
                                    state: familyData,
                                })
                            }
                        >
                            + Add Member
                        </button>

                    </div>

                    <hr />

                    {
                        familyMembers.length === 0 ? (

                            <p className="text-center text-muted">
                                No Members Added Yet
                            </p>

                        ) : (

                            <table className="table table-bordered table-hover">

                                <thead>

                                    <tr>

                                        <th>Name</th>
                                        <th>Gender</th>
                                        <th>Age</th>
                                        <th>Mobile</th>
                                        <th>Action</th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {
                                        familyMembers.map((member) => (

                                            <tr key={member.id}>

                                                <td>{member.fullName}</td>

                                                <td>{member.gender}</td>

                                                <td>{member.age}</td>

                                                <td>{member.mobileNo}</td>

                                                <td>

                                                    <button className="btn btn-sm btn-primary me-2">
                                                        View
                                                    </button>

                                                    <button
                                                        className="btn btn-sm btn-warning"
                                                        onClick={() => handleEditMember(member)}
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => handleDeleteMember(member)}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>

                                            </tr>

                                        ))
                                    }

                                </tbody>

                            </table>

                        )
                    }

                </div>

            </div>

        </div>

    );

}

export default FamilyDetails;