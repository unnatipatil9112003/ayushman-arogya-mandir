import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function AddFamily() {

  const navigate = useNavigate();
  const location = useLocation();
  const editFamily = location.state;
  // console.log(location.state);

  const [houseNumber, setHouseNumber] = useState(
    editFamily?.houseNumber || ""
  );
  const [center, setCenter] = useState(
    editFamily?.center || ""
  );
  const [subCenter, setSubCenter] = useState(
    editFamily?.subCenter || ""
  );
  const [village, setVillage] = useState(
    editFamily?.village || ""
  );
  const [address, setAddress] = useState(
    editFamily?.address || ""
  );
  const [rationCard, setRationCard] = useState(
    editFamily?.rationCard || ""
  );
  const [category, setCategory] = useState(
    editFamily?.category || ""
  );
  const [toiletFacility, setToiletFacility] = useState(
    editFamily?.toiletFacility || ""
  );
  const [centers, setCenters] = useState([]);
  const [subCenters, setSubCenters] = useState([]);
  const [villages, setVillages] = useState([]);

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
          console.log("Centers API Error:", error.response.data);
        } else {
          console.log(error);
        }

      }

    };

    fetchCenters();

  }, []);

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

        console.log("Sub Centers:", response.data.data);

        setSubCenters(response.data.data);

      } catch (error) {

        if (error.response) {
          console.log("Sub Center API Error:", error.response.data);
        } else {
          console.log(error);
        }

      }

    };

    fetchSubCenters();

  }, [center]);

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

        console.log("Villages:", response.data.data);

        setVillages(response.data.data);

      } catch (error) {

        if (error.response) {
          console.log("Village API Error:", error.response.data);
        } else {
          console.log(error);
        }

      }

    };

    fetchVillages();

  }, [subCenter]);

  const handleNext = async () => {

    const token = localStorage.getItem("token");

    const familyData = {
      id: editFamily?.id || 0,
      house_no: houseNumber,
      village_id: village,
      address: address,
      ration_card: rationCard,
      card_type: rationCard,
      social_category: category,
      sanitation_facility: toiletFacility
    };

    try {

      const response = await axios.post(
        "http://localhost/backend/api/v1/save_family.php",
        familyData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      console.log("Save Family Response:", response.data);

      if (response.data.status === "success") {

        navigate("/family-details", {
          state: {
            familyId: response.data.family_id,
            houseNumber,
            village
          }
        });

      } else {

        alert(response.data.message);

      }

    } catch (error) {

      console.error("Save Family Error:", error);

    }

  };
  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="main-content">
        <h2>Add Family</h2>

        <div className="card p-4 mt-4">

          {/* House Number */}

          <div className="mb-3">
            <label className="form-label">House Number</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter House Number"
              value={houseNumber}
              onChange={(e) => setHouseNumber(e.target.value)}
            />
          </div>

          {/* Center */}

          <div className="mb-3">
            <label className="form-label">Center</label>
            <select
              className="form-select"
              value={center}
              onChange={(e) => {
                setCenter(e.target.value);
                setSubCenter("");
                setVillage("");
              }}
            >
              <option value="">Select Center</option>
              {centers.map((centerItem) => (

                <option
                  key={centerItem.id}
                  value={centerItem.id}
                >
                  {centerItem.name}
                </option>

              ))}
            </select>
          </div>

          {/* Sub Center */}

          <div className="mb-3">
            <label className="form-label">Sub Center</label>
            <select
              className="form-select"
              value={subCenter}
              onChange={(e) => {
                setSubCenter(e.target.value);
                setVillage("");
              }}
            >
              <option value="">Select Sub Center</option>
              {subCenters.map((subCenterItem) => (

                <option
                  key={subCenterItem.id}
                  value={subCenterItem.id}
                >
                  {subCenterItem.name}
                </option>

              ))}
            </select>
          </div>

          {/* Village */}

          <div className="mb-3">
            <label className="form-label">Village</label>
            <select
              className="form-select"
              value={village}
              onChange={(e) => setVillage(e.target.value)}
            >
              <option value="">Select Village</option>
              {villages.map((villageItem) => (

                <option
                  key={villageItem.id}
                  value={villageItem.id}
                >
                  {villageItem.name}
                </option>

              ))}
            </select>
          </div>

          {/* Address */}

          <div className="mb-3">
            <label className="form-label">Address</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Enter Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            ></textarea>
          </div>

          {/* Ration Card */}

          <div className="mb-3">
            <label className="form-label">Ration Card Type</label>
            <select
              className="form-select"
              value={rationCard}
              onChange={(e) => setRationCard(e.target.value)}
            >
              <option value="">Select Ration Card</option>
              <option value="APL">APL</option>
              <option value="BPL">BPL</option>
              <option value="Antyodaya">Antyodaya</option>
            </select>
          </div>

          {/* Category */}

          <div className="mb-3">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              <option value="General">General</option>
              <option value="OBC">OBC</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
            </select>
          </div>

          {/* Toilet Facility */}

          <div className="mb-4">
            <label className="form-label d-block">
              Toilet Facility Available?
            </label>

            <div className="d-flex gap-3">

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="toilet"
                  value="Yes"
                  checked={toiletFacility === "Yes"}
                  onChange={(e) => setToiletFacility(e.target.value)}
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
                  checked={toiletFacility === "No"}
                  onChange={(e) => setToiletFacility(e.target.value)}
                />
                <label className="form-check-label">
                  No
                </label>
              </div>

            </div>

          </div>

          {/* Button */}

          <div className="text-end">

            <button
              className="btn add-btn"
              onClick={handleNext}
            >
              Save & Next
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}

export default AddFamily;






//  const handleNext = () => {

//     const existingFamilies =
//       JSON.parse(localStorage.getItem("families")) || [];

//     if (editFamily) {

//       // EDIT MODE

//       const updatedFamily = {
//         ...editFamily,
//         houseNumber,
//         center,
//         subCenter,
//         village,
//         address,
//         rationCard,
//         category,
//         toiletFacility,
//       };

//       const updatedFamilies = existingFamilies.map((family) =>
//         family.id === editFamily.id
//           ? updatedFamily
//           : family
//       );

//       localStorage.setItem(
//         "families",
//         JSON.stringify(updatedFamilies)
//       );

//       navigate("/family-details", {
//         state: updatedFamily,
//       });

//     } else {

//       // ADD MODE

//       const newFamily = {
//         id: Date.now(),
//         houseNumber,
//         center,
//         subCenter,
//         village,
//         address,
//         rationCard,
//         category,
//         toiletFacility,
//       };

//       existingFamilies.push(newFamily);

//       localStorage.setItem(
//         "families",
//         JSON.stringify(existingFamilies)
//       );

//       navigate("/family-details", {
//         state: newFamily,
//       });

//     }

//   };
