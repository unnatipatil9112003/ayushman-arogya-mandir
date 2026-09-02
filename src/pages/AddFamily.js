import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/addFamily.css";

function AddFamily() {

    const navigate = useNavigate();
    const location = useLocation();
    const editFamily = location.state;

    const [houseNumber, setHouseNumber] = useState(
        editFamily?.house_no || ""
    );

    const [center, setCenter] = useState(
        editFamily?.center_id || ""
    );

    const [subCenter, setSubCenter] = useState(
        editFamily?.sub_center_id || ""
    );

    const [village, setVillage] = useState(
        editFamily?.village_id || ""
    );

    const [address, setAddress] = useState(
        editFamily?.address || ""
    );

    const [rationCard, setRationCard] = useState(
        editFamily?.ration_card || ""
    );

    const [category, setCategory] = useState(
        editFamily?.social_category || ""
    );

    const [toiletFacility, setToiletFacility] = useState(
        editFamily?.sanitation_facility || ""
    );

    const [centers, setCenters] = useState([]);
    const [subCenters, setSubCenters] = useState([]);
    const [villages, setVillages] = useState([]);


    // =========================================
    // FETCH CENTERS
    // =========================================

    useEffect(() => {

        const fetchCenters = async () => {

            try {

                const token = localStorage.getItem("token");

                const response = await axios.get(
                    "http://localhost/backend/api/v1/get_centers.php",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                console.log(response.data.data);

                setCenters(response.data.data);

            } catch (error) {

                if (error.response) {

                    console.log(
                        "Centers API Error:",
                        error.response.data
                    );

                } else {

                    console.log(error);

                }

            }

        };

        fetchCenters();

    }, []);


    // =========================================
    // FETCH SUB CENTERS
    // =========================================

    useEffect(() => {

        if (!center) return;

        const fetchSubCenters = async () => {

            try {

                const token = localStorage.getItem("token");

                const response = await axios.get(
                    `http://localhost/backend/api/v1/get_sub_centers.php?center_id=${center}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                console.log(
                    "Sub Centers:",
                    response.data.data
                );

                setSubCenters(response.data.data);

            } catch (error) {

                if (error.response) {

                    console.log(
                        "Sub Center API Error:",
                        error.response.data
                    );

                } else {

                    console.log(error);

                }

            }

        };

        fetchSubCenters();

    }, [center]);


    // =========================================
    // FETCH VILLAGES
    // =========================================

    useEffect(() => {

        if (!subCenter) return;

        const fetchVillages = async () => {

            try {

                const token = localStorage.getItem("token");

                const response = await axios.get(
                    `http://localhost/backend/api/v1/get_villages.php?sub_center_id=${subCenter}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                console.log(
                    "Villages:",
                    response.data.data
                );

                setVillages(response.data.data);

            } catch (error) {

                if (error.response) {

                    console.log(
                        "Village API Error:",
                        error.response.data
                    );

                } else {

                    console.log(error);

                }

            }

        };

        fetchVillages();

    }, [subCenter]);


    // =========================================
    // SAVE / UPDATE FAMILY
    // =========================================

    const handleNext = async () => {

        const token = localStorage.getItem("token");

        const familyData = {

            family_id: editFamily?.id || 0,

            house_no: houseNumber,

            village_id: village,

            address: address,

            ration_card: rationCard,

            card_type: editFamily?.card_type || "",

            social_category: category,

            sanitation_facility: toiletFacility,

            members: []

        };

        console.log(
            "Family Data Sending:",
            familyData
        );

        try {

            let response;


            // =========================================
            // EDIT EXISTING FAMILY
            // =========================================

            if (editFamily?.id) {

                response = await axios.post(

                    "http://localhost/backend/api/v1/update_family.php",

                    familyData,

                    {
                        headers: {

                            Authorization:
                                `Bearer ${token}`,

                            "Content-Type":
                                "application/json"

                        }

                    }

                );


            } else {


                // =========================================
                // ADD NEW FAMILY
                // =========================================

                response = await axios.post(

                    "http://localhost/backend/api/v1/save_family.php",

                    {

                        id: 0,

                        house_no:
                            houseNumber,

                        village_id:
                            village,

                        address:
                            address,

                        ration_card:
                            rationCard,

                        card_type:
                            editFamily?.card_type || "",

                        social_category:
                            category,

                        sanitation_facility:
                            toiletFacility

                    },

                    {
                        headers: {

                            Authorization:
                                `Bearer ${token}`,

                            "Content-Type":
                                "application/json"

                        }

                    }

                );

            }


            console.log(
                "Save/Update Family Response:",
                response.data
            );


            // =========================================
            // SUCCESS
            // =========================================

            if (
                response.data.status ===
                "success"
            ) {

                const familyId =
                    editFamily?.id ||
                    response.data.family_id;


                navigate(
                    "/family-details",
                    {
                        state: {
                            familyId:
                                familyId
                        }
                    }
                );


            } else {

                alert(
                    response.data.message ||
                    "Unable to save family."
                );

            }


        } catch (error) {

            console.error(
                "Save/Update Family Error:",
                error
            );


            if (error.response) {

                console.error(
                    "Server Response:",
                    error.response.data
                );

                alert(
                    error.response.data.message ||
                    "Unable to save family."
                );


            } else {

                alert(
                    "Unable to connect to the server."
                );

            }

        }

    };


    // =========================================
    // UI
    // =========================================

    return (

        <div className="dashboard-container">

            <Sidebar />


            <div className="main-content add-family-page">


                {/* =========================================
                    PAGE HEADER
                ========================================= */}

                <div className="add-family-header">

                    <div>

                        <h2>
                            {editFamily?.id
                                ? "Edit Family"
                                : "Add Family"}
                        </h2>

                        <p>
                            {editFamily?.id
                                ? "कुटुंबाची माहिती संपादित करा"
                                : "नवीन कुटुंबाची माहिती भरा"}
                        </p>

                    </div>

                </div>


                {/* =========================================
                    FORM CARD
                ========================================= */}

                <div className="add-family-card">


                    <div className="add-family-form-grid">


                        {/* =========================================
                            HOUSE NUMBER
                        ========================================= */}

                        <div className="add-family-field">

                            <label className="form-label">
                                House Number
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter House Number"
                                value={houseNumber}
                                onChange={(e) =>
                                    setHouseNumber(
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        {/* =========================================
                            CENTER
                        ========================================= */}

                        <div className="add-family-field">

                            <label className="form-label">
                                Center
                            </label>

                            <select
                                className="form-select"
                                value={center}
                                onChange={(e) => {

                                    setCenter(
                                        e.target.value
                                    );

                                    setSubCenter("");

                                    setVillage("");

                                }}
                            >

                                <option value="">
                                    Select Center
                                </option>


                                {centers.map(
                                    (centerItem) => (

                                        <option
                                            key={
                                                centerItem.id
                                            }
                                            value={
                                                centerItem.id
                                            }
                                        >

                                            {
                                                centerItem.name
                                            }

                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* =========================================
                            SUB CENTER
                        ========================================= */}

                        <div className="add-family-field">

                            <label className="form-label">
                                Sub Center
                            </label>

                            <select
                                className="form-select"
                                value={subCenter}
                                onChange={(e) => {

                                    setSubCenter(
                                        e.target.value
                                    );

                                    setVillage("");

                                }}
                            >

                                <option value="">
                                    Select Sub Center
                                </option>


                                {subCenters.map(
                                    (subCenterItem) => (

                                        <option
                                            key={
                                                subCenterItem.id
                                            }
                                            value={
                                                subCenterItem.id
                                            }
                                        >

                                            {
                                                subCenterItem.name
                                            }

                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* =========================================
                            VILLAGE
                        ========================================= */}

                        <div className="add-family-field">

                            <label className="form-label">
                                Village
                            </label>

                            <select
                                className="form-select"
                                value={village}
                                onChange={(e) =>
                                    setVillage(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="">
                                    Select Village
                                </option>


                                {villages.map(
                                    (villageItem) => (

                                        <option
                                            key={
                                                villageItem.id
                                            }
                                            value={
                                                villageItem.id
                                            }
                                        >

                                            {
                                                villageItem.name
                                            }

                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* =========================================
                            ADDRESS
                        ========================================= */}

                        <div className="add-family-field full-width">

                            <label className="form-label">
                                Address
                            </label>

                            <textarea
                                className="form-control"
                                rows="3"
                                placeholder="Enter Address"
                                value={address}
                                onChange={(e) =>
                                    setAddress(
                                        e.target.value
                                    )
                                }
                            ></textarea>

                        </div>


                        {/* =========================================
                            RATION CARD
                        ========================================= */}

                        <div className="add-family-field">

                            <label className="form-label">
                                Ration Card Type
                            </label>

                            <select
                                className="form-select"
                                value={rationCard}
                                onChange={(e) =>
                                    setRationCard(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="">
                                    Select Ration Card
                                </option>

                                <option value="APL">
                                    APL
                                </option>

                                <option value="BPL">
                                    BPL
                                </option>

                                <option value="Antyodaya">
                                    Antyodaya
                                </option>

                            </select>

                        </div>


                        {/* =========================================
                            CATEGORY
                        ========================================= */}

                        <div className="add-family-field">

                            <label className="form-label">
                                Category
                            </label>

                            <select
                                className="form-select"
                                value={category}
                                onChange={(e) =>
                                    setCategory(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="">
                                    Select Category
                                </option>

                                <option value="General">
                                    General
                                </option>

                                <option value="OBC">
                                    OBC
                                </option>

                                <option value="SC">
                                    SC
                                </option>

                                <option value="ST">
                                    ST
                                </option>

                            </select>

                        </div>


                        {/* =========================================
                            TOILET FACILITY
                        ========================================= */}

                        <div className="add-family-field full-width">

                            <label className="form-label d-block">

                                Toilet Facility
                                Available?

                            </label>


                            <div className="toilet-options">


                                <div className="form-check">

                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="toilet"
                                        value="Yes"
                                        checked={
                                            toiletFacility ===
                                            "Yes"
                                        }
                                        onChange={(e) =>
                                            setToiletFacility(
                                                e.target.value
                                            )
                                        }
                                    />

                                    <label className="form-check-label">

                                        Yes

                                    </label>

                                </div>


                                <div className="form-check">

                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="toilet"
                                        value="No"
                                        checked={
                                            toiletFacility ===
                                            "No"
                                        }
                                        onChange={(e) =>
                                            setToiletFacility(
                                                e.target.value
                                            )
                                        }
                                    />

                                    <label className="form-check-label">

                                        No

                                    </label>

                                </div>


                            </div>

                        </div>


                    </div>


                    {/* =========================================
                        FORM FOOTER
                    ========================================= */}

                    <div className="add-family-footer">

                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() =>
                                navigate("/families")
                            }
                        >

                            Cancel

                        </button>


                        <button
                            type="button"
                            className="add-family-save-btn"
                            onClick={handleNext}
                        >

                            {editFamily?.id
                                ? "Save Changes"
                                : "Save & Next"}

                        </button>

                    </div>


                </div>

            </div>

        </div>

    );

}

export default AddFamily;