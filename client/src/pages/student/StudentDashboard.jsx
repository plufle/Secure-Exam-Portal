import { useNavigate } from "react-router-dom";
import { logout } from "../../services/LoginAuth";
import "../admin/AdminDashboard.css";
import "./StudentDashboard.css";
import { useState } from "react";
import { MdMenuBook, MdWindow } from "react-icons/md";
import { PiStudentFill } from "react-icons/pi";
import { BsGraphUp } from "react-icons/bs";
import img from "../../assets/user.png";

import Dashboard from "./Subpages/Dashboard";
import Exams from "./Subpages/Exams";
import Reports from "./Subpages/Report";
import ExamPrestart from "./Subpages/ExamPrestart";
import ActiveExam from "./Subpages/ActiveExam";
import Results from "./Subpages/Results";

function StudentDashboard() {
    const navigate = useNavigate();
    const [activePage, setActivePage] = useState("dashboard");
    const [selectedExam, setSelectedExam] = useState(null);
    const [examResults, setExamResults] = useState(null);

    const userName = localStorage.getItem("name") ? localStorage.getItem("name").charAt(0).toUpperCase() + localStorage.getItem("name").slice(1) : "Student";

    const handleSelectExam = (exam) => {
        setSelectedExam(exam);
        setActivePage('prestart');
    };

    const handleStartExam = () => {
        setActivePage('active');
    };

    const handleSubmitExam = (results) => {
        setExamResults(results);
        setActivePage('results');
    };

    const handleOpenReport = (report) => {
        setExamResults({ ...report });
        setActivePage('results');
    };

    if (['prestart', 'active', 'results'].includes(activePage)) {
        return (
            <div className="student-dashboard-app" style={{minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
               {activePage === "prestart" && <ExamPrestart exam={selectedExam} onStart={handleStartExam} onBack={() => setActivePage('exams')} />}
               {activePage === "active" && <ActiveExam exam={selectedExam} onSubmit={handleSubmitExam} />}
               {activePage === "results" && <Results results={examResults} onBack={() => setActivePage('reports')} />}
            </div>
        );
    }

    return (
        <div className="dashboard-container student-dashboard-app">
            <div className="sidebar">
                <div className="sidebar-content">
                    <div className="sidebar-header">
                        <MdMenuBook className="brand-icon" />
                        <h1 className="brand-title" style={{margin: 0}}>ExamPortal</h1>
                    </div>
                    <div className="nav-menu">
                        <ul>
                            <li onClick={() => setActivePage("dashboard")}> 
                                <div className={`nav-item ${activePage === "dashboard" ? "active" : ""}`}>
                                    <MdWindow className="nav-icon" />
                                    <p className="nav-label" style={{margin: 0}}>Dashboard</p>
                                </div>
                            </li>
                            <li onClick={() => setActivePage("exams")}>
                                <div className={`nav-item ${activePage === "exams" ? "active" : ""}`}>
                                    <PiStudentFill className="nav-icon" />
                                    <p className="nav-label" style={{margin: 0}}>Exams</p>
                                </div>
                            </li>
                            <li onClick={() => setActivePage("reports")}>
                                <div className={`nav-item ${activePage === "reports" ? "active" : ""}`}>
                                    <BsGraphUp className="nav-icon" />
                                    <p className="nav-label" style={{margin: 0}}>Reports</p>
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
                <h1 className="top-bar-title" style={{margin: 0}}>Welcome back, {userName}</h1>
                <div className="top-bar-user">
                    <img src={img} alt="" className="top-bar-icon" />
                    <div>
                        <p className="top-bar-subtitle" style={{margin: 0}}>{userName}</p>
                        <p className="top-bar-text" style={{margin: 0}}>Student</p>
                    </div>
                </div>
            </div>
            <div className="main-content">
                {activePage === "dashboard" && <Dashboard user={{name: userName}} onSelectExam={handleSelectExam} />}
                {activePage === "exams" && <Exams onSelectExam={handleSelectExam} />}
                {activePage === "reports" && <Reports onOpenReport={handleOpenReport} />}
            </div>
        </div>
    );
}

export default StudentDashboard;