import React from "react";
import Sidebar from "../components/Sidebar";

function SubCenter() {

    return (

        <div className="dashboard-container">

            <Sidebar />

            <div className="main-content">

                <div className="dashboard-header">

                    <h2>Sub-Centers</h2>

                    <button className="btn add-btn">
                        + Add Sub-Center
                    </button>

                </div>

                <hr />

                <table className="table table-bordered text-center">

                    <thead>

                        <tr>

                            <th>ID</th>

                            <th>Center Name</th>

                            <th>Sub-Center Name</th>

                            <th>Action</th>

                        </tr>

                    </thead>

                    <tbody>

                        <tr>

                            <td colSpan="4">

                                No Sub-Centers Found

                            </td>

                        </tr>

                    </tbody>

                </table>

            </div>

        </div>

    );

}

export default SubCenter;