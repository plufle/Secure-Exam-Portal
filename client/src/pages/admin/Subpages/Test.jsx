import "./Test.css";
import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { getClassroom, addTest, getTests, editTest, deleteTest } from "../../../services/Admin";
function Test() {
    const [showAddForm, setShowAddForm] = useState(false);
    const [showViewEditForm, setShowViewEditForm] = useState(false);

    // Form State for Adding
    const [testName, setTestName] = useState("");
    const [classroomId, setClassroomId] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [duration, setDuration] = useState("");
    const [totalMarks, setTotalMarks] = useState("");
    const [questions, setQuestions] = useState([{ question: "", options: ["", "", "", ""], answer: "", marks: "" }]);

    const [classroomOptions, setClassroomOptions] = useState([]);
    const [tests, setTests] = useState([]);

    useEffect(() => {
        const fetchData = () => {
            getClassroom().then(res => setClassroomOptions(res.classrooms)).catch(console.error);
            getTests().then(res => setTests(res.tests)).catch(console.error);
        };
        fetchData();
    }, []);

    // State for Viewing/Editing
    const [selectedTest, setSelectedTest] = useState(null);

    // Handlers for Add Form
    const handleAddQuestion = () => {
        setQuestions([...questions, { question: "", options: ["", "", "", ""], answer: "", marks: "" }]);
    };

    const handleRemoveQuestion = (index) => {
        const newQuestions = questions.filter((_, i) => i !== index);
        setQuestions(newQuestions);
    };

    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...questions];
        newQuestions[index][field] = value;
        setQuestions(newQuestions);
    };

    const handleOptionChange = (index, optionIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[index].options[optionIndex] = value;
        setQuestions(newQuestions);
    };

    const resetAddForm = () => {
        setTestName("");
        setClassroomId("");
        setDate("");
        setTime("");
        setDuration("");
        setTotalMarks("");
        setQuestions([{ question: "", options: ["", "", "", ""], answer: "", marks: "" }]);
        setShowAddForm(false);
    };

    // Handlers for View/Edit Form
    const handleViewEdit = (test, isViewOnly = false) => {
        let parsedQuestions = test.questions;
        console.log(parsedQuestions)
        if (typeof test.questions === "string") {
            try {
                parsedQuestions = JSON.parse(test.questions);
            } catch (e) {
                console.error("Failed to parse questions string", e);
                parsedQuestions = [];
            }
        }

        let safeQuestions = [];
        if (Array.isArray(parsedQuestions)) {
            safeQuestions = parsedQuestions.map(q => ({
                question: q.question || "",
                options: Array.isArray(q.options) && q.options.length === 4 ? [...q.options] : ["", "", "", ""],
                answer: q.answer || "",
                marks: q.marks || ""
            }));
        }
        
        // Ensure classroomId is set properly for the dropdown (either raw ID or populated object's ID)
        const cId = test.classroomId?._id || test.classroomId || "";
        
        // Format Date to YYYY-MM-DD
        let formattedDate = "";
        if (test.date) {
            try {
                formattedDate = new Date(test.date).toISOString().split('T')[0];
            } catch (e) {
                console.error("Invalid date format", test.date);
            }
        }
        setSelectedTest({ 
            ...test, 
            classroomId: cId,
            date: formattedDate,
            questions: safeQuestions.length > 0 ? safeQuestions : [{ question: "", options: ["", "", "", ""], answer: "", marks: "" }],
            isViewOnly 
        });
        setShowViewEditForm(true);
    };

    const handleEditChange = (field, value) => {
        if (selectedTest.isViewOnly) return;
        setSelectedTest({ ...selectedTest, [field]: value });
    };

    const handleEditQuestionChange = (index, field, value) => {
        if (selectedTest.isViewOnly) return;
        const updatedQuestions = [...selectedTest.questions];
        updatedQuestions[index][field] = value;
        setSelectedTest({ ...selectedTest, questions: updatedQuestions });
    };

    const handleEditOptionChange = (index, optionIndex, value) => {
        if (selectedTest.isViewOnly) return;
        const updatedQuestions = [...selectedTest.questions];
        updatedQuestions[index].options[optionIndex] = value;
        setSelectedTest({ ...selectedTest, questions: updatedQuestions });
    };

    const handleAddQuestionToEdit = () => {
        if (selectedTest.isViewOnly) return;
        setSelectedTest({
            ...selectedTest,
            questions: [...selectedTest.questions, { question: "", options: ["", "", "", ""], answer: "", marks: "" }]
        });
    };

    const handleRemoveQuestionFromEdit = (index) => {
        if (selectedTest.isViewOnly) return;
        const updatedQuestions = selectedTest.questions.filter((_, i) => i !== index);
        setSelectedTest({ ...selectedTest, questions: updatedQuestions });
    };

    const handleCreateTest = () => {
        const req = {
            testName, classroomId, date, time, duration, totalMarks, questions
        };
        addTest(req).then(res => {
            getTests().then(res => setTests(res.tests)).catch(console.error); // Re-fetch to get populated fields and proper _id
            resetAddForm();
        }).catch(err => console.log(err));
    };

    const handleUpdateTest = () => {
        const req = {
            testId: selectedTest._id,
            testName: selectedTest.testName,
            classroomId: selectedTest.classroomId,
            date: selectedTest.date,
            time: selectedTest.time,
            duration: selectedTest.duration,
            totalMarks: selectedTest.totalMarks,
            questions: selectedTest.questions
        };
        editTest(req).then(res => {
            getTests().then(res => setTests(res.tests)).catch(console.error); // Re-fetch
            setShowViewEditForm(false);
        }).catch(err => console.log(err));
    };

    const handleDeleteTest = (testId) => {
        if(window.confirm("Are you sure you want to delete this test?")) {
            deleteTest(testId).then(() => {
                setTests(tests.filter(t => t._id !== testId));
            }).catch(err => console.log(err));
        }
    };

    return (
        <div className="test-container">
            <div className="test-header">
                <div className="test-header-left">
                    <h1 className="test-header-title">Tests</h1>
                    <p className="test-header-text">Manage your tests and assessments</p>
                </div>
                <div className="test-header-right">
                    <button className="test-header-button" onClick={() => setShowAddForm(true)}>Add Test</button>
                </div>
            </div>

            {/* Add Test Form Overlay */}
            {showAddForm && (
                <div className="overlay">
                    <div className="test-form">
                        <div className="test-form-header">
                            <h1 className="test-form-title">Add New Test</h1>
                            <button className="test-form-close" onClick={resetAddForm}>Close</button>
                        </div>
                        <div className="test-form-body">
                            <div className="test-form-row">
                                <input 
                                    type="text" 
                                    className="test-form-input" 
                                    placeholder="Test Name"
                                    value={testName}
                                    onChange={(e) => setTestName(e.target.value)}
                                />
                                <select 
                                    className="test-form-input" 
                                    placeholder="Classroom ID"
                                    value={classroomId}
                                    onChange={(e) => setClassroomId(e.target.value)}
                                >
                                    <option value="">Select Classroom</option>
                                    {classroomOptions.map((classroom) => (
                                        <option key={classroom._id} value={classroom._id}>
                                            {classroom.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="test-form-row">
                                <input 
                                    type="date" 
                                    className="test-form-input" 
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                                <input 
                                    type="time" 
                                    className="test-form-input" 
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                />
                            </div>
                            <div className="test-form-row">
                                <input 
                                    type="number" 
                                    className="test-form-input" 
                                    placeholder="Duration (mins)"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                />
                                <input 
                                    type="number" 
                                    className="test-form-input" 
                                    placeholder="Total Marks"
                                    value={totalMarks}
                                    onChange={(e) => setTotalMarks(e.target.value)}
                                />
                            </div>

                            <div className="questions-section">
                                <div className="questions-header">
                                    <h3>Questions</h3>
                                    <button className="add-question-btn" onClick={handleAddQuestion}>+ Add Question</button>
                                </div>
                                <div className="questions-list-container">
                                    {questions.map((q, index) => (
                                        <div key={index} className="question-item">
                                            <div className="question-row">
                                                <input 
                                                    type="text" 
                                                    className="test-form-input" 
                                                    placeholder={`Question ${index + 1}`}
                                                    value={q.question}
                                                    onChange={(e) => handleQuestionChange(index, "question", e.target.value)}
                                                />
                                                <button className="remove-question-btn" onClick={() => handleRemoveQuestion(index)}>
                                                    <MdDelete />
                                                </button>
                                            </div>
                                            <div className="options-container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                                                {[0, 1, 2, 3].map(optIndex => (
                                                    <input 
                                                        key={optIndex}
                                                        type="text"
                                                        className="test-form-input"
                                                        placeholder={`Option ${optIndex + 1}`}
                                                        value={q.options[optIndex]}
                                                        onChange={(e) => handleOptionChange(index, optIndex, e.target.value)}
                                                    />
                                                ))}
                                            </div>
                                            <div className="question-row" style={{ marginTop: '10px' }}>
                                                <input 
                                                    type="text" 
                                                    className="test-form-input" 
                                                    placeholder="Answer (e.g., Option 1 text)"
                                                    value={q.answer}
                                                    onChange={(e) => handleQuestionChange(index, "answer", e.target.value)}
                                                />
                                                 <input 
                                                    type="number" 
                                                    className="test-form-input" 
                                                    placeholder="Marks"
                                                    style={{ width: "100px" }}
                                                    value={q.marks}
                                                    onChange={(e) => handleQuestionChange(index, "marks", e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="test-form-footer">
                            <button className="test-form-button cancel" onClick={resetAddForm}>Cancel</button>
                            <button className="test-form-button" onClick={handleCreateTest}>Create Test</button>
                        </div>
                    </div>
                </div>
            )}

            {/* View/Edit Test Form Overlay */}
            {showViewEditForm && selectedTest && (
                <div className="overlay">
                    <div className="test-form">
                        <div className="test-form-header">
                            <h1 className="test-form-title">{selectedTest.isViewOnly ? "View Test Details" : "Edit Test Details"}</h1>
                            <button className="test-form-close" onClick={() => setShowViewEditForm(false)}>Close</button>
                        </div>
                        <div className="test-form-body">
                             <div className="test-form-row">
                                <input 
                                    type="text" 
                                    className="test-form-input" 
                                    placeholder="Test Name"
                                    value={selectedTest.testName || ""}
                                    readOnly={selectedTest.isViewOnly}
                                    onChange={(e) => handleEditChange("testName", e.target.value)}
                                />
                                <select 
                                    className="test-form-input" 
                                    value={selectedTest.classroomId}
                                    disabled={selectedTest.isViewOnly}
                                    onChange={(e) => handleEditChange("classroomId", e.target.value)}
                                >
                                    <option value="">Select Classroom</option>
                                    {classroomOptions.map((classroom) => (
                                        <option key={classroom._id} value={classroom._id}>
                                            {classroom.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="test-form-row">
                                <input 
                                    type="date" 
                                    className="test-form-input" 
                                    value={selectedTest.date || ""}
                                    readOnly={selectedTest.isViewOnly}
                                    onChange={(e) => handleEditChange("date", e.target.value)}
                                />
                                <input 
                                    type="time" 
                                    className="test-form-input" 
                                    value={selectedTest.time || ""}
                                    readOnly={selectedTest.isViewOnly}
                                    onChange={(e) => handleEditChange("time", e.target.value)}
                                />
                            </div>
                            <div className="test-form-row">
                                <input 
                                    type="number" 
                                    className="test-form-input" 
                                    placeholder="Duration (mins)"
                                    value={selectedTest.duration || ""}
                                    readOnly={selectedTest.isViewOnly}
                                    onChange={(e) => handleEditChange("duration", e.target.value)}
                                />
                                <input 
                                    type="number" 
                                    className="test-form-input" 
                                    placeholder="Total Marks"
                                    value={selectedTest.totalMarks || ""}
                                    readOnly={selectedTest.isViewOnly}
                                    onChange={(e) => handleEditChange("totalMarks", e.target.value)}
                                />
                            </div>

                            <div className="questions-section">
                                <div className="questions-header">
                                    <h3>Questions</h3>
                                    {!selectedTest.isViewOnly && (
                                        <button className="add-question-btn" onClick={handleAddQuestionToEdit}>+ Add Question</button>
                                    )}
                                </div>
                                <div className="questions-list-container">
                                    {selectedTest.questions && selectedTest.questions.map((q, index) => (
                                        <div key={index} className="question-item">
                                            <div className="question-row">
                                                <input 
                                                    type="text" 
                                                    className="test-form-input" 
                                                    placeholder={`Question ${index + 1}`}
                                                    value={q.question}
                                                    readOnly={selectedTest.isViewOnly}
                                                    onChange={(e) => handleEditQuestionChange(index, "question", e.target.value)}
                                                />
                                                {!selectedTest.isViewOnly && (
                                                    <button className="remove-question-btn" onClick={() => handleRemoveQuestionFromEdit(index)}>
                                                        <MdDelete />
                                                    </button>
                                                )}
                                            </div>
                                            <div className="options-container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                                                {[0, 1, 2, 3].map(optIndex => (
                                                    <input 
                                                        key={optIndex}
                                                        type="text"
                                                        className="test-form-input"
                                                        placeholder={`Option ${optIndex + 1}`}
                                                        value={q.options && q.options[optIndex]? q.options[optIndex] : ""}
                                                        readOnly={selectedTest.isViewOnly}
                                                        onChange={(e) => handleEditOptionChange(index, optIndex, e.target.value)}
                                                    />
                                                ))}
                                            </div>
                                            <div className="question-row" style={{ marginTop: '10px' }}>
                                                <input 
                                                    type="text" 
                                                    className="test-form-input" 
                                                    placeholder="Answer (e.g., Option 1 text)"
                                                    value={q.answer || ""}
                                                    readOnly={selectedTest.isViewOnly}
                                                    onChange={(e) => handleEditQuestionChange(index, "answer", e.target.value)}
                                                />
                                                 <input 
                                                    type="number" 
                                                    className="test-form-input" 
                                                    placeholder="Marks"
                                                    style={{ width: "100px" }}
                                                    value={q.marks}
                                                    readOnly={selectedTest.isViewOnly}
                                                    onChange={(e) => handleEditQuestionChange(index, "marks", e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="test-form-footer">
                            <button className="test-form-button cancel" onClick={() => setShowViewEditForm(false)}>Close</button>
                            {!selectedTest.isViewOnly && (
                                <button className="test-form-button" onClick={handleUpdateTest}>Save Changes</button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="test-table">
                <table>
                    <thead>
                        <tr>
                            <th className="test-table-th">Test Name</th>
                            <th className="test-table-th">Classroom ID</th>
                            <th className="test-table-th">Status</th>
                            <th className="test-table-th">Date</th>
                            <th className="test-table-th">Time</th>
                            <th className="test-table-th">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tests.map((test) => (
                            <tr key={test._id} className="test-table-tr">
                                <td className="test-table-td">{test.testName}</td>
                                <td className="test-table-td">{test.classroomId?.name || test.classroomId || 'N/A'}</td>
                                <td className="test-table-td">Scheduled</td>
                                <td className="test-table-td">{test.date ? new Date(test.date).toLocaleDateString() : 'N/A'}</td>
                                <td className="test-table-td">{test.time}</td>
                                <td className="test-table-td">
                                    <div className="button-container">
                                        <button className="test-td-button" onClick={() => handleViewEdit(test, true)}>View</button>
                                        <button className="test-td-button" onClick={() => handleViewEdit(test, false)}>Edit</button>
                                        <button className="test-td-button delete" onClick={() => handleDeleteTest(test._id)}><MdDelete /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Test;
