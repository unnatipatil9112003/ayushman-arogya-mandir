import { useLocation, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import Sidebar from "../components/Sidebar";


function AddMember() {

    const location = useLocation();
    const familyData =
        location.state?.familyData || location.state;

    const editMember =
        location.state?.editMember || null;
    const navigate = useNavigate();

    console.log("Family");
    console.log(familyData);

    console.log("Member");
    console.log(editMember);

    const [fullName, setFullName] = useState(
        editMember?.fullName || ""
    );
    const [gender, setGender] = useState(
        editMember?.gender || ""
    );
    const [dob, setDob] = useState(
        editMember?.dob || ""
    );
    const [age, setAge] = useState(
        editMember?.age || ""
    );
    const [mobileNo, setMobileNo] = useState(
        editMember?.mobileNo || ""
    );
    const [aadhaarNo, setAadhaarNo] = useState(
        editMember?.aadhaarNo || ""
    );

    const [hasSugar, setHasSugar] = useState(
        editMember?.hasSugar || false
    );
    const [hasBP, setHasBP] = useState(
        editMember?.hasBP || false
    );
    const [otherDiseases, setOtherDiseases] = useState(
        editMember?.otherDiseases || ""
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
        editMember?.isHead || false
    );
    const [isAlive, setIsAlive] = useState(
        editMember?.isAlive ?? true
    );
    const [dateOfDeath, setDateOfDeath] = useState(
        editMember?.dateOfDeath || ""
    );

    const handleSaveMember = () => {
        const memberData = {
            id: editMember ? editMember.id : Date.now(),
            familyId: familyData.id,
            fullName,
            gender,
            dob,
            age,
            mobileNo,
            aadhaarNo,
            hasSugar,
            hasBP,
            otherDiseases,
            education,
            occupation,
            maritalStatus,
            isHead,
            isAlive,
            dateOfDeath
        };
        const members =
            JSON.parse(localStorage.getItem("members")) || [];

        let updatedMembers;

        if (editMember) {

            updatedMembers = members.map((member) =>
                member.id === editMember.id
                    ? memberData
                    : member

            );

        } else {
            updatedMembers = [...members, memberData];
        }

        localStorage.setItem(
            "members",
            JSON.stringify(updatedMembers)

        );

        navigate("/family-details", {
            state: familyData,
        });
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

                    <div className="form-check mb-2">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            checked={hasSugar}
                            onChange={(e) => setHasSugar(e.target.checked)}
                        />
                        <label className="form-check-label">
                            Sugar
                        </label>
                    </div>

                    <div className="form-check mb-3">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            checked={hasBP}
                            onChange={(e) => setHasBP(e.target.checked)}
                        />
                        <label className="form-check-label">
                            BP
                        </label>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Other Diseases</label>
                        <textarea
                            className="form-control"
                            rows="3"
                            value={otherDiseases}
                            onChange={(e) => setOtherDiseases(e.target.value)}
                        />
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