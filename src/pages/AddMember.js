import { useLocation, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { getApiUrl } from "../config/api";
import Sidebar from "../components/Sidebar";
import "../styles/addMember.css";

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
    console.log("Member:", editMember);

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


    /* =========================
       LOAD DISEASES
    ========================= */

    useEffect(() => {

        const loadDiseases = async () => {

            try {

                const token = localStorage.getItem("token");

                const familyId =
                    familyData.id ||
                    familyData.familyId;

                console.log(
                    "Loading diseases for family:",
                    familyId
                );

                const response = await axios.get(
                    `${getApiUrl("get_family_details.php")}?id=${familyId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                console.log(
                    "Diseases API:",
                    response.data.data.diseases
                );

                setDiseases(
                    response.data.data.diseases
                );

            } catch (error) {

                console.error(
                    "Disease Load Error:",
                    error
                );

            }

        };

        loadDiseases();

    }, []);


    /* =========================
       SAVE MEMBER
    ========================= */

    const handleSaveMember = async () => {

        const memberData = {

            id: editMember?.id || 0,

            family_id:
                familyData.id ||
                familyData.familyId,

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


        console.log(
            "Member Data Sending:",
            memberData
        );


        try {

            const token =
                localStorage.getItem("token");

            const response = await axios.post(
                getApiUrl("save_member.php"),
                memberData,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                        "Content-Type":
                            "application/json"
                    }
                }
            );


            console.log(
                "Save Member Response:",
                response.data
            );


            if (
                response.data.status ===
                "success"
            ) {

                navigate(
                    "/family-details",
                    {
                        state: familyData
                    }
                );

            } else {

                alert(
                    response.data.message
                );

            }

        } catch (error) {

            console.error(
                "Save Member Error:",
                error
            );

        }

    };


    /* =========================
       CANCEL
    ========================= */

    const handleCancel = () => {

        navigate(
            "/family-details",
            {
                state: {
                    familyId:
                        familyData?.id ||
                        familyData?.familyId
                }
            }
        );

    };


    return (

        <div className="dashboard-container">

            <Sidebar />

            <div className="main-content">

                {/* PAGE HEADER */}

                <div className="member-page-header">

                    <div>

                        <h2>
                            {editMember
                                ? "Edit Family Member"
                                : "Add Family Member"}
                        </h2>

                        <p>
                            Enter family member information
                        </p>

                    </div>

                    <button
                        type="button"
                        className="member-back-btn"
                        onClick={handleCancel}
                    >
                        ← Back
                    </button>

                </div>


                {/* FORM */}

                <div className="member-form-card">


                    {/* =========================
                        PERSONAL INFORMATION
                    ========================= */}

                    <div className="member-section">

                        <div className="member-section-title">

                            <div className="member-section-icon">
                                👤
                            </div>

                            <div>
                                <h4>
                                    Personal Information
                                </h4>

                                <span>
                                    Basic details of the family member
                                </span>
                            </div>

                        </div>


                        <div className="member-form-grid">


                            {/* FULL NAME */}

                            <div className="member-field member-field-full">

                                <label>
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter full name"
                                    value={fullName}
                                    onChange={(e) =>
                                        setFullName(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>


                            {/* GENDER */}

                            <div className="member-field">

                                <label>
                                    Gender
                                </label>

                                <select
                                    className="form-select"
                                    value={gender}
                                    onChange={(e) =>
                                        setGender(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="">
                                        Select Gender
                                    </option>

                                    <option value="Male">
                                        Male
                                    </option>

                                    <option value="Female">
                                        Female
                                    </option>

                                    <option value="Other">
                                        Other
                                    </option>

                                </select>

                            </div>


                            {/* DOB */}

                            <div className="member-field">

                                <label>
                                    Date of Birth
                                </label>

                                <input
                                    type="date"
                                    className="form-control"
                                    value={dob}
                                    onChange={(e) =>
                                        setDob(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>


                            {/* AGE */}

                            <div className="member-field">

                                <label>
                                    Age
                                </label>

                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Enter age"
                                    value={age}
                                    onChange={(e) =>
                                        setAge(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>


                            {/* MOBILE */}

                            <div className="member-field">

                                <label>
                                    Mobile Number
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter mobile number"
                                    value={mobileNo}
                                    onChange={(e) =>
                                        setMobileNo(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>


                            {/* AADHAAR */}

                            <div className="member-field">

                                <label>
                                    Aadhaar Number
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Aadhaar number"
                                    value={aadhaarNo}
                                    onChange={(e) =>
                                        setAadhaarNo(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>

                        </div>

                    </div>


                    {/* =========================
                        HEALTH INFORMATION
                    ========================= */}

                    <div className="member-section">

                        <div className="member-section-title">

                            <div className="member-section-icon">
                                ❤
                            </div>

                            <div>

                                <h4>
                                    Health Information
                                </h4>

                                <span>
                                    Health conditions and current status
                                </span>

                            </div>

                        </div>


                        <div className="member-health-box">

                            <label className="member-main-label">
                                Diseases
                            </label>

                            <div className="disease-grid">

                                {diseases.length === 0 ? (

                                    <p className="text-muted">
                                        No diseases available
                                    </p>

                                ) : (

                                    diseases.map(
                                        (disease) => (

                                            <div
                                                className="disease-option"
                                                key={disease.id}
                                            >

                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    checked={
                                                        selectedDiseases.includes(
                                                            Number(
                                                                disease.id
                                                            )
                                                        )
                                                    }
                                                    onChange={(e) => {

                                                        if (
                                                            e.target.checked
                                                        ) {

                                                            setSelectedDiseases(
                                                                [
                                                                    ...selectedDiseases,
                                                                    Number(
                                                                        disease.id
                                                                    )
                                                                ]
                                                            );

                                                        } else {

                                                            setSelectedDiseases(
                                                                selectedDiseases.filter(
                                                                    (id) =>
                                                                        Number(
                                                                            id
                                                                        ) !==
                                                                        Number(
                                                                            disease.id
                                                                        )
                                                                )
                                                            );

                                                        }

                                                    }}
                                                />

                                                <label>
                                                    {disease.name}
                                                </label>

                                            </div>

                                        )
                                    )

                                )}

                            </div>

                        </div>


                        {/* ALIVE */}

                        <div className="member-alive-box">

                            <label className="member-main-label">
                                Is Alive?
                            </label>

                            <div className="alive-options">

                                <label className="alive-option">

                                    <input
                                        type="radio"
                                        name="alive"
                                        value="true"
                                        checked={
                                            isAlive === true
                                        }
                                        onChange={() =>
                                            setIsAlive(true)
                                        }
                                    />

                                    <span>
                                        Yes
                                    </span>

                                </label>


                                <label className="alive-option">

                                    <input
                                        type="radio"
                                        name="alive"
                                        value="false"
                                        checked={
                                            isAlive === false
                                        }
                                        onChange={() =>
                                            setIsAlive(false)
                                        }
                                    />

                                    <span>
                                        No
                                    </span>

                                </label>

                            </div>

                        </div>


                        {!isAlive && (

                            <div className="member-field death-field">

                                <label>
                                    Date of Death
                                </label>

                                <input
                                    type="date"
                                    className="form-control"
                                    value={dateOfDeath}
                                    onChange={(e) =>
                                        setDateOfDeath(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>

                        )}

                    </div>


                    {/* =========================
                        EDUCATION & OCCUPATION
                    ========================= */}

                    <div className="member-section">

                        <div className="member-section-title">

                            <div className="member-section-icon">
                                🎓
                            </div>

                            <div>

                                <h4>
                                    Education & Occupation
                                </h4>

                                <span>
                                    Education, employment and marital information
                                </span>

                            </div>

                        </div>


                        <div className="member-form-grid">


                            {/* EDUCATION */}

                            <div className="member-field">

                                <label>
                                    Education
                                </label>

                                <select
                                    className="form-select"
                                    value={education}
                                    onChange={(e) =>
                                        setEducation(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="">
                                        Select Education
                                    </option>

                                    <option>
                                        Illiterate
                                    </option>

                                    <option>
                                        Primary
                                    </option>

                                    <option>
                                        Secondary
                                    </option>

                                    <option>
                                        Higher Secondary
                                    </option>

                                    <option>
                                        Graduate
                                    </option>

                                    <option>
                                        Post Graduate
                                    </option>

                                </select>

                            </div>


                            {/* OCCUPATION */}

                            <div className="member-field">

                                <label>
                                    Occupation
                                </label>

                                <select
                                    className="form-select"
                                    value={occupation}
                                    onChange={(e) =>
                                        setOccupation(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="">
                                        Select Occupation
                                    </option>

                                    <option>
                                        Farmer
                                    </option>

                                    <option>
                                        Student
                                    </option>

                                    <option>
                                        Government Employee
                                    </option>

                                    <option>
                                        Private Employee
                                    </option>

                                    <option>
                                        Business
                                    </option>

                                    <option>
                                        Housewife
                                    </option>

                                    <option>
                                        Labour
                                    </option>

                                    <option>
                                        Retired
                                    </option>

                                    <option>
                                        Unemployed
                                    </option>

                                </select>

                            </div>


                            {/* MARITAL STATUS */}

                            <div className="member-field">

                                <label>
                                    Marital Status
                                </label>

                                <select
                                    className="form-select"
                                    value={maritalStatus}
                                    onChange={(e) =>
                                        setMaritalStatus(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="">
                                        Select Marital Status
                                    </option>

                                    <option>
                                        Single
                                    </option>

                                    <option>
                                        Married
                                    </option>

                                    <option>
                                        Divorced
                                    </option>

                                    <option>
                                        Widowed
                                    </option>

                                </select>

                            </div>

                        </div>

                    </div>


                    {/* =========================
                        FAMILY ROLE
                    ========================= */}

                    <div className="member-section">

                        <div className="member-section-title">

                            <div className="member-section-icon">
                                🏠
                            </div>

                            <div>

                                <h4>
                                    Family Role
                                </h4>

                                <span>
                                    Family member responsibilities
                                </span>

                            </div>

                        </div>


                        <label className="head-family-option">

                            <input
                                type="checkbox"
                                checked={isHead}
                                onChange={(e) =>
                                    setIsHead(
                                        e.target.checked
                                    )
                                }
                            />

                            <div>

                                <strong>
                                    Head of Family
                                </strong>

                                <small>
                                    Mark this member as the head of the family
                                </small>

                            </div>

                        </label>

                    </div>


                    {/* =========================
                        ACTIONS
                    ========================= */}

                    <div className="member-form-actions">

                        <button
                            type="button"
                            className="member-cancel-btn"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            className="member-save-btn"
                            onClick={handleSaveMember}
                        >
                            {editMember
                                ? "Update Member"
                                : "Save Member"}
                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default AddMember;