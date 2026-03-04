import { useNavigate } from "react-router-dom";
import { logout } from "../../services/LoginAuth";
import "./AdminDashboard.css";
import { useState } from "react";
import { MdAdminPanelSettings } from "react-icons/md";
import { MdWindow } from "react-icons/md";
import { PiStudentFill } from "react-icons/pi";
import { LuFileSpreadsheet } from "react-icons/lu";
import { BsGraphUp } from "react-icons/bs";
import img from "../../assets/user.png"

import Dashboard from "./Subpages/Dashboard";
import ClassRoom from "./Subpages/ClassRoom";
import Test from "./Subpages/Test";
import Reports from "./Subpages/Report";

function AdminDashboard() {
    const navigate = useNavigate();
    const [activePage, setActivePage] = useState("dashboard");
    return (
        <div className="dashboard-container">
            <div className="sidebar">
                <div className="sidebar-content">
                    <div className="sidebar-header">
                        <MdAdminPanelSettings className="brand-icon" />
                        <h1 className="brand-title">ExamPortal</h1>
                    </div>
                    <div className="nav-menu">
                        <ul>
                            <li onClick={() => setActivePage("dashboard")}> 
                                <div className={`nav-item ${activePage === "dashboard" ? "active" : ""}`}>
                                    <MdWindow className="nav-icon" />
                                    <p className="nav-label ">Dashboard</p>
                                </div>
                            </li>
                            <li onClick={() => setActivePage("classroom")}>
                                <div className={`nav-item ${activePage === "classroom" ? "active" : ""}`}>
                                    <PiStudentFill className="nav-icon" />
                                    <p className="nav-label">ClassRoom</p>
                                </div>
                            </li>
                            <li onClick={() => setActivePage("tests")}>
                                <div className={`nav-item ${activePage === "tests" ? "active" : ""}`}>
                                    <LuFileSpreadsheet className="nav-icon" />
                                    <p className="nav-label">Tests</p>
                                </div>
                            </li>
                            <li onClick={() => setActivePage("reports")}>
                                <div className={`nav-item ${activePage === "reports" ? "active" : ""}`}>
                                    <BsGraphUp className="nav-icon" />
                                    <p className="nav-label">Reports</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={() => {
                        logout();
                        navigate("/");
                    }}>Sign Out</button>
                </div>
            </div>
            <div className="top-bar">
                <h1 className="top-bar-title">Manage exams. Monitor progress. Lead confidently.</h1>
                <div className="top-bar-user">
                    <img src={img} alt="" className="top-bar-icon" />
                    <div>
                        <p className="top-bar-subtitle">{localStorage.getItem("name").charAt(0).toUpperCase() + localStorage.getItem("name").slice(1)}</p>
                        <p className="top-bar-text">Faculty</p>
                    </div>
                </div>
            </div>
            <div className="main-content">
                {activePage === "dashboard" && <Dashboard />}
                {activePage === "classroom" && <ClassRoom />}
                {activePage === "tests" && <Test />}
                {activePage === "reports" && <Reports />}
            </div>
        </div>
    );
}

export default AdminDashboard;