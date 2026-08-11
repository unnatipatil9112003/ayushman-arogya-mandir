import { useLocation, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";


function AddMember() {

    const location = useLocation();
    const familyData =
        location.state?.family ||
        location.state?.familyData ||
        location.state;

    const editMember =
        location.state?.editMember || null;
    const navigate = useNavigate();

    console.log("Family Data:", familyData);

    console.log("Family");
    console.log(familyData);

    console.log("Member");
    console.log(editMember);

    const [fullName, setFullName] = useState(
        editMember?.full_name || ""
    );
    const [gender, setGender] = useState(
        editMember?.gender || ""
    );
    const [dob, setDob] = useState(
        editMember?.dob || ""
    );
    const [age, setAge] = useState(
        editMember?.approx_age || ""
    );
    const [mobileNo, setMobileNo] = useState(
        editMember?.mobile_no || ""
    );
    const [aadhaarNo, setAadhaarNo] = useState(
        editMember?.aadhaar_no || ""
    );

    const [diseases, setDiseases] = useState([]);

    const [selectedDiseases, setSelectedDiseases] = useState(
        (editMember?.disease_ids || []).map(Number)
    );

    const [education, setEducation] = useState(
        editMember?.education || ""
    );
    const [occupation, setOccupation] = useState(
        editMember?.occupation || ""
    );
    const [maritalStatus, setMaritalStatus] = useState(
        editMember?.maritalStatus || ""
    );

    const [isHead, setIsHead] = useState(
        editMember?.is_head || false
    );
    const [isAlive, setIsAlive] = useState(
        editMember?.is_alive ?? true
    );
    const [dateOfDeath, setDateOfDeath] = useState(
        editMember?.dateOfDeath || ""
    );

    useEffect(() => {

        const loadDiseases = async () => {

            try {

                const token = localStorage.getItem("token");

                const familyId = familyData.id || familyData.familyId;

                console.log("Loading diseases for family:", familyId);

                const response = await axios.get(
                    `http://localhost/backend/api/v1/get_family_details.php?id=${familyId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                console.log("Diseases API:", response.data.data.diseases);

                setDiseases(response.data.data.diseases);

            } catch (error) {

                console.error("Disease Load Error:", error);

            }

        };

        loadDiseases();

    }, []);

    const handleSaveMember = async () => {
        const memberData = {
            id: editMember?.id || 0,
            family_id: familyData.id || familyData.familyId,
            full_name: fullName,
            relation: "",
            approx_age: age,
            dob: dob,
            gender: gender,
            mobile_no: mobileNo,
            email: "",
            is_alive: isAlive ? 1 : 0,
            is_head: isHead,
            disease_ids: selectedDiseases
        };


        console.log("Member Data Sending:");
        console.log(memberData);
        console.log("Member Data Sending:", memberData);

        try {

            const token = localStorage.getItem("token");

            const response = await axios.post(
                "http://localhost/backend/api/v1/save_member.php",
                memberData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            console.log("Save Member Response:", response.data);

            if (response.data.status === "success") {

                navigate("/family-details", {
                    state: familyData
                });

            } else {

                alert(response.data.message);

            }

        } catch (error) {

            console.error("Save Member Error:", error);

        }
    };

    return (
        <div className="dashboard-container">
            <Sidebar />
            <div className="main-content">
                <div className="card p-4">
                    <h3>Add Family Member</h3>

                    {/* Full Name */}
                    <div className="mb-3">
                        <label className="form-label">Full Name</label>
                        <input
                            type="text"
                            className="form-control"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                    </div>

                    {/* Gender */}
                    <div className="mb-3">
                        <label className="form-label">Gender</label>
                        <select
                            className="form-select"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {/* Date of Birth */}
                    <div className="mb-3">
                        <label className="form-label">Date of Birth</label>
                        <input
                            type="date"
                            className="form-control"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                        />
                    </div>

                    {/* Age */}
                    <div className="mb-3">
                        <label className="form-label">Age</label>
                        <input
                            type="number"
                            className="form-control"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                        />
                    </div>

                    {/* Mobile Number */}
                    <div className="mb-3">
                        <label className="form-label">Mobile Number</label>
                        <input
                            type="text"
                            className="form-control"
                            value={mobileNo}
                            onChange={(e) => setMobileNo(e.target.value)}
                        />
                    </div>

                    {/* Aadhaar Number */}
                    <div className="mb-3">
                        <label className="form-label">Aadhaar Number</label>
                        <input
                            type="text"
                            className="form-control"
                            value={aadhaarNo}
                            onChange={(e) => setAadhaarNo(e.target.value)}
                        />
                    </div>

                    <hr />

                    <div className="mb-3">

                        <label className="form-label">
                            Diseases
                        </label>

                        {
                            diseases.map((disease) => (

                                <div
                                    className="form-check"
                                    key={disease.id}
                                >

                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={selectedDiseases.includes(Number(disease.id))}
                                        onChange={(e) => {

                                            if (e.target.checked) {

                                                setSelectedDiseases([
                                                    ...selectedDiseases,
                                                    Number(disease.id)
                                                ]);

                                            } else {

                                                setSelectedDiseases(
                                                    selectedDiseases.filter(
                                                        (id) =>
                                                            Number(id) !== Number(disease.id)
                                                    )
                                                );

                                            }

                                        }}
                                    />

                                    <label className="form-check-label">
                                        {disease.name}
                                    </label>

                                </div>

                            ))
                        }

                    </div>

                    <hr />

                    <div className="mb-3">
                        <label className="form-label">Education</label>

                        <select
                            className="form-select"
                            value={education}
                            onChange={(e) => setEducation(e.target.value)}
                        >
                            <option value="">Select Education</option>
                            <option>Illiterate</option>
                            <option>Primary</option>
                            <option>Secondary</option>
                            <option>Higher Secondary</option>
                            <option>Graduate</option>
                            <option>Post Graduate</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Occupation</label>

                        <select
                            className="form-select"
                            value={occupation}
                            onChange={(e) => setOccupation(e.target.value)}
                        >
                            <option value="">Select Occupation</option>
                            <option>Farmer</option>
                            <option>Student</option>
                            <option>Government Employee</option>
                            <option>Private Employee</option>
                            <option>Business</option>
                            <option>Housewife</option>
                            <option>Labour</option>
                            <option>Retired</option>
                            <option>Unemployed</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Marital Status</label>

                        <select
                            className="form-select"
                            value={maritalStatus}
                            onChange={(e) => setMaritalStatus(e.target.value)}
                        >
                            <option value="">Select Marital Status</option>
                            <option>Single</option>
                            <option>Married</option>
                            <option>Divorced</option>
                            <option>Widowed</option>
                        </select>
                    </div>

                    <hr />

                    <div className="form-check mb-3">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            checked={isHead}
                            onChange={(e) => setIsHead(e.target.checked)}
                        />
                        <label className="form-check-label">
                            Head of Family
                        </label>
                    </div>

                    <label className="form-label d-block">
                        Is Alive?
                    </label>

                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="alive"
                            value="true"
                            checked={isAlive === true}
                            onChange={() => setIsAlive(true)}
                        />
                        <label className="form-check-label">
                            Yes
                        </label>
                    </div>

                    <div className="form-check mb-3">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="alive"
                            value="false"
                            checked={isAlive === false}
                            onChange={() => setIsAlive(false)}
                        />
                        <label className="form-check-label">
                            No
                        </label>
                    </div>

                    {!isAlive && (
                        <div className="mb-3">
                            <label className="form-label">
                                Date of Death
                            </label>

                            <input
                                type="date"
                                className="form-control"
                                value={dateOfDeath}
                                onChange={(e) => setDateOfDeath(e.target.value)}
                            />
                        </div>
                    )}
                    <hr />

                    <div className="d-flex justify-content-end gap-2 mt-4">

                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() =>
                                navigate("/family-details", {
                                    state: {
                                        familyId:
                                            familyData?.id ||
                                            familyData?.familyId
                                    }
                                })
                            }
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            className="btn add-btn"
                            onClick={handleSaveMember}
                        >
                            Save Member
                        </button>

                    </div>

                </div>
            </div>
        </div>
    );
}

export default AddMember;