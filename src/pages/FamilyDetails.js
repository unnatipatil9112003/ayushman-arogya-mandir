import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function FamilyDetails() {

    const location = useLocation();
    const familyData = location.state;
    const navigate = useNavigate();

    const members =
        JSON.parse(localStorage.getItem("members")) || [];

    const familyMembers =
        members.filter(
            (member) =>
                member.familyId === familyData.id
        );
    console.log(familyMembers);

    const handleEditMember = (member) => {

        navigate("/add-member", {
            state: {
                familyData,
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

                    <p><strong>House Number:</strong> {familyData?.houseNumber}</p>
                    <p><strong>Center:</strong> {familyData?.center}</p>
                    <p><strong>Sub Center:</strong> {familyData?.subCenter}</p>
                    <p><strong>Village:</strong> {familyData?.village}</p>
                    <p><strong>Address:</strong> {familyData?.address}</p>
                    <p><strong>Ration Card:</strong> {familyData?.rationCard}</p>
                    <p><strong>Category:</strong> {familyData?.category}</p>
                    <p><strong>Toilet:</strong> {familyData?.toiletFacility}</p>

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