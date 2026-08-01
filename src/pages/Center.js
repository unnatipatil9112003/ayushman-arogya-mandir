import React from "react";
import Sidebar from "../components/Sidebar";

function Center() {

    return (

        <div className="dashboard-container">

            <Sidebar />

            <div className="main-content">

                <div className="dashboard-header">

                    <h2>Centers</h2>

                    <button className="btn add-btn">
                        + Add Center
                    </button>

                </div>

                <hr />

                <table className="table table-bordered text-center">

                    <thead>

                        <tr>

                            <th>ID</th>

                            <th>Center Name</th>

                            <th>Action</th>

                        </tr>

                    </thead>

                    <tbody>

                        <tr>

                            <td colSpan="3">

                                No Centers Found

                            </td>

                        </tr>

                    </tbody>

                </table>

            </div>

        </div>

    );

}

export default Center;