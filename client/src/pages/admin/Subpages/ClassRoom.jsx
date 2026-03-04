import "./ClassRoom.css";
import { useState, useEffect } from "react";
import { MdDelete } from "react-icons/md";
import { addClassroom, getClassroom, deleteClassroom, editClassroom } from "../../../services/Admin";

function ClassRoom() {
    const [showform, setShowForm] = useState(false);
    const [showViewStudents, setShowViewStudents] = useState(false);
    const [classroomName, setClassroomName] = useState("");
    const [students, setStudents] = useState([{ regno: "", email: "" }]);
    const [selectedClassroom, setSelectedClassroom] = useState(null);
    const [classrooms, setClassrooms] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);

    const fetchClassrooms = () => {
        getClassroom().then(res => {
            setClassrooms(res.classrooms);
        }).catch(console.error);
    };

    useEffect(() => {
        fetchClassrooms();
    }, []);

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

    const handleViewStudents = (classroomId) => {
        setSelectedClassroom(classroomId);
        setShowViewStudents(true);
    };

    const openAddClassroom = () => {
        setIsEditMode(false);
        setClassroomName("");
        setStudents([{ regno: "", email: "" }]);
        setSelectedClassroom(null);
        setShowForm(true);
    };

    const handleEditClassroom = (classroom) => {
        setIsEditMode(true);
        setClassroomName(classroom.name);
        setSelectedClassroom(classroom._id);
        const mappedStudents = classroom.students.map(s => ({
            regno: s.regNo || s.regno,
            email: s.email
        }));
        setStudents(mappedStudents.length > 0 ? mappedStudents : [{ regno: "", email: "" }]);
        setShowForm(true);
    };

    const handleAddClassroom = () => {
        setShowForm(false);
        const req = {
            name: classroomName,
            students: students
        };

        if (isEditMode) {
            req.classroomId = selectedClassroom;
            editClassroom(req)
                .then(res => {
                    fetchClassrooms();
                })
                .catch(err => {
                    // silent or handle error UI
                });
        } else {
            addClassroom(req)
                .then(res => {
                    fetchClassrooms();
                })
                .catch(err => {
                    // silent or handle error UI
                });
        }
    };

    const handleDeleteClassroom = (classroomId) => {
        if (window.confirm("Are you sure you want to delete this classroom?")) {
            deleteClassroom(classroomId)
                .then(res => {
                    fetchClassrooms();
                })
                .catch(err => {
                    // silent or handle error UI
                });
        }
    };
    return (
        <div className="classroom-container">
            <div className="classroom-header">
                <div className="classroom-header-left">
                    <h1 className="classroom-header-title">ClassRoom</h1>
                    <p className="classroom-header-text">Manage your classrooms</p>
                </div>
                <div className="classroom-header-right">
                    <button className="classroom-header-button" onClick={openAddClassroom}>Add Classroom</button>
                </div>
            </div>

            {/* Add Classroom Form Overlay */}
            {showform && (
                <div className="overlay">
                    <div className="classroom-form">
                        <div className="classroom-form-header">
                            <h1 className="classroom-form-title">{isEditMode ? "Edit Classroom" : "Add Classroom"}</h1>
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
                            <button className="classroom-form-button" onClick={handleAddClassroom}>{isEditMode ? "Save" : "Add"}</button>
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
                                    {classrooms.map((classroom, i) => (
                                        selectedClassroom === classroom._id && (
                                            classroom.students.map((student, j) => (
                                                <tr key={j}>
                                                    <td>{student.regNo}</td>
                                                    <td>{student.email}</td>
                                                </tr>
                                            ))
                                        )
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
                        {classrooms && classrooms.map((classroom, index) => (
                            <tr key={index} className="classroomtable-tr">
                                <td className="classroomtable-td">{classroom.name}</td>
                                <td className="classroomtable-td">{classroom.students.length}</td>
                                <td className="classroomtable-td button-container">
                                    <button className="classroomtable-td-button" onClick={() => handleViewStudents(classroom._id)}>View</button>
                                    <button className="classroomtable-td-button" onClick={() => handleEditClassroom(classroom)}>Edit</button>
                                    <button className="classroomtable-td-button" onClick={() => handleDeleteClassroom(classroom._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ClassRoom;