import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { MdPerson, MdClass, MdAssignment } from 'react-icons/md';
import { getClassroom, getTests } from '../../../services/Admin';

function Dashboard() {
    const [classrooms, setClassrooms] = useState([]);
    const [tests, setTests] = useState([]);
    
    // Retrieve Auth Details from localStorage
    const adminName = localStorage.getItem("name") || "Admin";
    const adminRole = localStorage.getItem("type") || "Administrator";
    const lastLoginRaw = localStorage.getItem("lastLogin");

    // Format lastLogin Date nicely
    let formattedLastLogin = "First Login / Session Active";
    if (lastLoginRaw) {
        const dateObj = new Date(lastLoginRaw);
        if (!isNaN(dateObj.getTime())) {
            formattedLastLogin = dateObj.toLocaleString('en-US', {
                weekday: 'short', 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit'
            });
        }
    }

    // Capitalize names
    const displayName = adminName.charAt(0).toUpperCase() + adminName.slice(1);
    const displayRole = adminRole.charAt(0).toUpperCase() + adminRole.slice(1);

    useEffect(() => {
        // Fetch classrooms
        getClassroom()
            .then(data => setClassrooms(data.classrooms || []))
            .catch(err => console.error("Failed to fetch classrooms", err));
            
        // Fetch tests
        getTests()
            .then(data => {
                const fetchedTests = data.tests || [];
                const activeTests = fetchedTests.filter(test => {
                    if (!test.date) return true;
                    try {
                        const dateStr = new Date(test.date).toISOString().split('T')[0];
                        const timeStr = test.time || "00:00";
                        const duration = parseInt(test.duration) || 0;
                        const testEndDate = new Date(`${dateStr}T${timeStr}`);
                        testEndDate.setMinutes(testEndDate.getMinutes() + duration);
                        return new Date() <= testEndDate;
                    } catch (e) {
                         return true;
                    }
                });
                setTests(activeTests);
            })
            .catch(err => console.error("Failed to fetch tests", err));
    }, []);

    return (
        <div className="dashboard-wrapper">
            <div className="dashboard-header-container">
                <h1 className="dashboard-main-title">Overview Dashboard</h1>
            </div>

            <div className="dashboard-cards-grid">
                {/* 1. User Details Card */}
                <div className="dashboard-info-card">
                    <div className="dashboard-card-top">
                        <MdPerson className="dashboard-card-icon" />
                        <h2 className="dashboard-card-heading">User Profile</h2>
                    </div>
                    <div className="dashboard-card-content">
                        <div className="dashboard-detail-row">
                            <span className="dashboard-detail-label">Name:</span>
                            <span className="dashboard-detail-value">{displayName}</span>
                        </div>
                        <div className="dashboard-detail-row">
                            <span className="dashboard-detail-label">Role:</span>
                            <span className="dashboard-detail-value">{displayRole}</span>
                        </div>
                        <div className="dashboard-detail-row">
                            <span className="dashboard-detail-label">Access Level:</span>
                            <span className="dashboard-detail-value">Full Access</span>
                        </div>
                    </div>
                </div>

                {/* 2. Classrooms Card */}
                <div className="dashboard-info-card">
                    <div className="dashboard-card-top">
                        <MdClass className="dashboard-card-icon" />
                        <h2 className="dashboard-card-heading">Classrooms</h2>
                    </div>
                    <div className="dashboard-card-content">
                        <div className="dashboard-stat-number">{classrooms.length}</div>
                        <p className="dashboard-stat-caption">Total Active Classrooms</p>
                    </div>
                </div>

                {/* 3. Tests Card */}
                <div className="dashboard-info-card">
                    <div className="dashboard-card-top">
                        <MdAssignment className="dashboard-card-icon" />
                        <h2 className="dashboard-card-heading">Scheduled Tests</h2>
                    </div>
                    <div className="dashboard-card-content">
                        <div className="dashboard-stat-number">{tests.length}</div>
                        <p className="dashboard-stat-caption">Total Active Tests</p>
                    </div>
                </div>
            </div>

            {/* Bottom Footer for Login Time */}
            <div className="dashboard-bottom-footer">
                <p><strong>Last Login:</strong> {formattedLastLogin}</p>
            </div>
        </div>
    );
}

export default Dashboard;