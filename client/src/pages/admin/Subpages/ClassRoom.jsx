import "./ClassRoom.css";
import { useState } from "react";
import { MdDelete } from "react-icons/md";

function ClassRoom() {
    const [showform, setShowForm] = useState(false);
    const [showViewStudents, setShowViewStudents] = useState(false);
    const [classroomName, setClassroomName] = useState("");
    const [students, setStudents] = useState([{ regno: "", email: "" }]);
    const [selectedClassroom, setSelectedClassroom] = useState(null);

    const dummyStudents = [
        { regno: "REG001", email: "student1@example.com" },
        { regno: "REG002", email: "student2@example.com" },
    ];

    const handleAddStudent = () => {
        setStudents([...students, { regno: "", email: "" }]);
    };

    const handleRemoveStudent = (index) => {
        const newStudents = students.filter((_, i) => i !== index);
        setStudents(newStudents);
    };

    const handleStudentChange = (index, field, value) => {
        const newStudents = [...students];
        newStudents[index][field] = value;
        setStudents(newStudents);
    };

    const handleViewStudents = (classroom) => {
        setSelectedClassroom(classroom);
        setShowViewStudents(true);
    };

    return (
        <div className="classroom-container">
            <div className="classroom-header">
                <div className="classroom-header-left">
                    <h1 className="classroom-header-title">ClassRoom</h1>
                    <p className="classroom-header-text">Manage your classrooms</p>
                </div>
                <div className="classroom-header-right">
                    <button className="classroom-header-button" onClick={() => setShowForm(true)}>Add Classroom</button>
                </div>
            </div>

            {/* Add Classroom Form Overlay */}
            {showform && (
                <div className="overlay">
                    <div className="classroom-form">
                        <div className="classroom-form-header">
                            <h1 className="classroom-form-title">Add Classroom</h1>
                            <button className="classroom-form-close" onClick={() => setShowForm(false)}>Close</button>
                        </div>
                        <div className="classroom-form-body">
                            <input 
                                type="text" 
                                className="classroom-form-input" 
                                placeholder="ClassRoom Name"
                                value={classroomName}
                                onChange={(e) => setClassroomName(e.target.value)}
                            />
                            
                            <div className="students-section">
                                <div className="students-header">
                                    <h3>Students</h3>
                                    <button className="add-student-btn" onClick={handleAddStudent}>+ Add Student</button>
                                </div>
                                <div className="students-list-container">
                                    {students.map((student, index) => (
                                        <div key={index} className="student-row">
                                            <input 
                                                type="text" 
                                                className="classroom-form-input small-input" 
                                                placeholder="Reg No"
                                                value={student.regno}
                                                onChange={(e) => handleStudentChange(index, "regno", e.target.value)}
                                            />
                                            <input 
                                                type="email" 
                                                className="classroom-form-input" 
                                                placeholder="Email"
                                                value={student.email}
                                                onChange={(e) => handleStudentChange(index, "email", e.target.value)}
                                            />
                                            {students.length > 1 && (
                                                <button className="remove-student-btn" onClick={() => handleRemoveStudent(index)}>
                                                    <MdDelete />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="classroom-form-footer">
                            <button className="classroom-form-button" onClick={() => setShowForm(false)}>Cancel</button>
                            <button className="classroom-form-button">Add</button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Students Overlay */}
            {showViewStudents && (
                <div className="overlay">
                    <div className="classroom-form view-mode">
                        <div className="classroom-form-header">
                            <h1 className="classroom-form-title">Students List</h1>
                            <button className="classroom-form-close" onClick={() => setShowViewStudents(false)}>Close</button>
                        </div>
                        <div className="classroom-form-body">
                            <table className="view-students-table">
                                <thead>
                                    <tr>
                                        <th>Reg No</th>
                                        <th>Email</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dummyStudents.map((std, i) => (
                                        <tr key={i}>
                                            <td>{std.regno}</td>
                                            <td>{std.email}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            <div className="classroomtable">
                <table>
                    <thead>
                        <tr>
                            <th className="classroomtable-th">ClassRoom</th>
                            <th className="classroomtable-th">Student Count</th>
                            <th className="classroomtable-th">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="classroomtable-tr">
                            <td className="classroomtable-td">ClassRoom 1</td>
                            <td className="classroomtable-td">10</td>
                            <td className="classroomtable-td button-container">
                                <button className="classroomtable-td-button" onClick={() => handleViewStudents({ name: "ClassRoom 1" })}>View</button>
                                <button className="classroomtable-td-button">Edit</button>
                                <button className="classroomtable-td-button">Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ClassRoom;