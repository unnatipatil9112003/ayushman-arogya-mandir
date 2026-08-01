import React from "react";
import Sidebar from "../components/Sidebar";

function Village() {

    return (

        <div className="dashboard-container">

            <Sidebar />

            <div className="main-content">

                <div className="dashboard-header">

                    <h2>Village</h2>

                    <button className="btn add-btn">
                        + Add Village
                    </button>

                </div>

                <hr />

                <table className="table table-bordered text-center">

                    <thead>

                        <tr>

                            <th>ID</th>
                            <th>Sub Center</th>
                            <th>Village</th>
                            <th>Population</th>
                            <th>Action</th>

                        </tr>

                    </thead>

                    <tbody>

                        <tr>

                            <td colSpan="5">

                                No village Found

                            </td>

                        </tr>

                    </tbody>

                </table>

            </div>

        </div>

    );

}

export default Village;